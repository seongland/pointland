import { useEffect, useRef, useCallback, useState, Suspense, memo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Splat, CameraControls, Sky, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei'
import type { CameraControls as CameraControlsImpl } from '@react-three/drei'
import { useUnit } from 'effector-react'
import { $gaussianSceneIndex, GAUSSIAN_SCENES, setGaussianSceneIndex } from '@/store/model'
import nipplejs from 'nipplejs'
import { ElementHold } from 'hold-event'

interface GaussianLandProps {
  splatUrl?: string
}

interface Control {
  force: number
  vector: { x: number; y: number }
}

// nipplejs 1.x calls every listener with one argument, the element moved from
// `el` to `ui.el`, and 'destroyed' became 'removed'. See src/hooks/useController.ts.
interface NippleEvent<T> {
  type: string
  data: T
}

interface JoystickMove {
  force: number
  vector: { x: number; y: number }
}

interface NippleJoystick {
  position: { x: number; y: number }
  ui: { el: HTMLElement }
  on(event: 'move', callback: (evt: NippleEvent<JoystickMove>) => void): void
  on(event: 'removed', callback: (evt: NippleEvent<NippleJoystick>) => void): void
}

interface JoystickManager {
  on(event: 'added', callback: (evt: NippleEvent<NippleJoystick>) => void): void
  destroy(): void
}

interface HoldEvent {
  deltaTime: number
}

// Keyboard controller using CameraControls methods (same as nipplejs)
const useGaussianKeyboardController = (controlsRef: React.RefObject<CameraControlsImpl | null>, moveSpeed: number) => {
  const keysPressed = useRef<Set<string>>(new Set())

  useEffect(() => {
    const keys = keysPressed.current

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      keys.add(e.code)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.code)
    }

    const updateMovement = () => {
      const ctrl = controlsRef.current
      if (!ctrl) {
        requestAnimationFrame(updateMovement)
        return
      }

      // Use CameraControls built-in methods - same as nipplejs controller
      // forward(): move along camera's look direction
      // truck(x, y): move horizontally (x) and vertically (y)

      // W/S: forward/backward
      if (keys.has('KeyW')) ctrl.forward(moveSpeed, true)
      if (keys.has('KeyS')) ctrl.forward(-moveSpeed, true)

      // A/D: strafe left/right
      if (keys.has('KeyA')) ctrl.truck(-moveSpeed, 0, true)
      if (keys.has('KeyD')) ctrl.truck(moveSpeed, 0, true)

      // Q/E: up/down (vertical truck)
      if (keys.has('KeyQ')) ctrl.truck(0, -moveSpeed, true)
      if (keys.has('KeyE')) ctrl.truck(0, moveSpeed, true)

      requestAnimationFrame(updateMovement)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    requestAnimationFrame(updateMovement)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      keys.clear()
    }
  }, [controlsRef, moveSpeed])
}

// 4-zone nipplejs controller - exact same as Tokyo PointLand
const useGaussianController = (controlsRef: React.RefObject<CameraControlsImpl | null>, moveSpeed: number) => {
  const [touchable, setTouchable] = useState(true)
  const dirControlRef = useRef<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const xyControlRef = useRef<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const zControlRef = useRef<Control>({ force: 0, vector: { x: 0, y: 0 } })

  // Bottom-right: rotation (camera look) - exact same as LayerSpace
  const dirNipple = useCallback(
    (nipple: NippleJoystick) => {
      const holder = new ElementHold(nipple.ui.el, 10)
      holder._holdStart()
      holder.addEventListener('holding', (event: HoldEvent) => {
        const controls = controlsRef.current
        if (!controls) return
        const ctrl = dirControlRef.current
        // Azimuth (horizontal) and polar (vertical) rotation
        // Same formula as LayerSpace useController.ts
        const azimuth = (-(ctrl.force * ctrl.vector.x) * event.deltaTime) / 2000
        const polar = (ctrl.force * ctrl.vector.y * event.deltaTime) / 2000
        controls.rotate(azimuth, polar, true)
      })
      nipple.on('move', (evt) => {
        dirControlRef.current = { force: evt.data.force, vector: evt.data.vector }
      })
      nipple.on('removed', () => {
        holder._holdEnd()
        dirControlRef.current = { force: 0, vector: { x: 0, y: 0 } }
      })
    },
    [controlsRef],
  )

  // Top-left: fast forward/backward and strafe
  const fastxyNipple = useCallback(
    (nipple: NippleJoystick) => {
      const holder = new ElementHold(nipple.ui.el, 10)
      holder._holdStart()
      holder.addEventListener('holding', (event: HoldEvent) => {
        const controls = controlsRef.current
        if (!controls) return
        const ctrl = xyControlRef.current
        controls.truck(ctrl.force * ctrl.vector.x * event.deltaTime * moveSpeed, 0, true)
        controls.forward(ctrl.force * ctrl.vector.y * event.deltaTime * moveSpeed, true)
      })
      nipple.on('move', (evt) => {
        xyControlRef.current = { force: evt.data.force, vector: evt.data.vector }
      })
      nipple.on('removed', () => {
        holder._holdEnd()
        xyControlRef.current = { force: 0, vector: { x: 0, y: 0 } }
      })
    },
    [controlsRef, moveSpeed],
  )

  // Top-right: slow strafe and vertical movement
  const zNipple = useCallback(
    (nipple: NippleJoystick) => {
      const holder = new ElementHold(nipple.ui.el, 10)
      holder._holdStart()
      holder.addEventListener('holding', (event: HoldEvent) => {
        const controls = controlsRef.current
        if (!controls) return
        const ctrl = zControlRef.current
        controls.truck(((ctrl.force * ctrl.vector.x) / 100) * event.deltaTime * moveSpeed, 0, true)
        controls.truck(0, -((ctrl.force * ctrl.vector.y) / 100) * event.deltaTime * moveSpeed, true)
      })
      nipple.on('move', (evt) => {
        zControlRef.current = { force: evt.data.force, vector: evt.data.vector }
      })
      nipple.on('removed', () => {
        holder._holdEnd()
        zControlRef.current = { force: 0, vector: { x: 0, y: 0 } }
      })
    },
    [controlsRef, moveSpeed],
  )

  // Bottom-left: slow forward/backward and strafe
  const xyNipple = useCallback(
    (nipple: NippleJoystick) => {
      const holder = new ElementHold(nipple.ui.el, 10)
      holder._holdStart()
      holder.addEventListener('holding', (event: HoldEvent) => {
        const controls = controlsRef.current
        if (!controls) return
        const ctrl = xyControlRef.current
        controls.truck(((ctrl.force * ctrl.vector.x) / 10) * event.deltaTime * moveSpeed, 0, true)
        controls.forward(((ctrl.force * ctrl.vector.y) / 10) * event.deltaTime * moveSpeed, true)
      })
      nipple.on('move', (evt) => {
        xyControlRef.current = { force: evt.data.force, vector: evt.data.vector }
      })
      nipple.on('removed', () => {
        holder._holdEnd()
        xyControlRef.current = { force: 0, vector: { x: 0, y: 0 } }
      })
    },
    [controlsRef, moveSpeed],
  )

  const nippleEvent = useCallback(
    (manager: JoystickManager) => {
      manager.on('added', (evt) => {
        const nipple = evt.data
        if (!nipple?.position) return

        // 4-zone setup - exact same as Tokyo PointLand
        if (nipple.position.x < window.innerWidth / 2 && nipple.position.y < window.innerHeight / 2) {
          fastxyNipple(nipple) // Top-left: fast movement
        } else if (nipple.position.y < window.innerHeight / 2) {
          zNipple(nipple) // Top-right: vertical movement
        } else if (nipple.position.x < window.innerWidth / 2) {
          xyNipple(nipple) // Bottom-left: slow movement
        } else {
          dirNipple(nipple) // Bottom-right: rotation
        }
      })
    },
    [dirNipple, fastxyNipple, xyNipple, zNipple],
  )

  const checkTouchable = useCallback(() => {
    setTouchable(true)
    let manager: JoystickManager | null = null

    const zone = document.getElementById('gaussian-nipple')
    if (!zone) {
      console.error('Nipple zone not found')
      return
    }

    try {
      // 1.x renamed maxNumberOfNipples and ignores the old key. The '.nipple'
      // sweep that used to live here matched nothing: 1.x names the element
      // 'joystick collection_N' and removes it itself.
      manager = nipplejs.create({
        zone,
        mode: 'dynamic',
        multitouch: true,
        maxNumberOfJoysticks: 2,
      }) as unknown as JoystickManager
      nippleEvent(manager)
    } catch (error) {
      console.error('Failed to create nipple:', error)
    }

    return () => {
      if (manager) {
        manager.destroy()
      }
      setTouchable(false)
    }
  }, [nippleEvent])

  return { checkTouchable, touchable }
}

// Scene selector component
const SceneSelector = () => {
  const sceneIndex = useUnit($gaussianSceneIndex)

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex gap-2 flex-wrap justify-center max-w-[90vw]">
      {GAUSSIAN_SCENES.map((scene, index) => (
        <button
          key={scene.name}
          onClick={() => setGaussianSceneIndex(index)}
          className="group relative flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          style={{
            background:
              sceneIndex === index
                ? 'linear-gradient(135deg, rgba(200,100,255,0.3) 0%, rgba(200,100,255,0.15) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
            border: sceneIndex === index ? '1px solid rgba(200,100,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.12),
              inset 0 1px 0 rgba(255,255,255,0.2),
              inset 0 -1px 0 rgba(0,0,0,0.1)
            `,
            backdropFilter: 'blur(20px)',
          }}
        >
          <span className="text-xs font-medium text-white/90">{scene.name}</span>
        </button>
      ))}
    </div>
  )
}

// Wrapper component that uses the controller
const GaussianLandInner = ({ splatUrl, scale }: { splatUrl: string; scale: 'small' | 'large' }) => {
  const controlsRef = useRef<CameraControlsImpl | null>(null)
  const isLarge = scale === 'large'
  // Dynamic speed for nipplejs - much slower for small scenes
  const moveSpeed = isLarge ? 0.5 : 0.01

  const { checkTouchable, touchable } = useGaussianController(controlsRef, moveSpeed)

  // Initialize nipplejs
  useEffect(() => {
    const cleanup = checkTouchable()
    return () => {
      if (cleanup) cleanup()
    }
  }, [checkTouchable])

  return (
    <>
      {touchable && <div id="gaussian-nipple" className="absolute inset-0 z-10 pointer-events-auto" />}
      <Canvas camera={getCameraConfig(scale)} gl={glConfig} dpr={[1, 1.5]} performance={{ min: 0.5 }} flat>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <PerformanceMonitor onDecline={() => console.log('Performance declining')} />
        <Suspense fallback={null}>
          <GaussianSceneWithRef splatUrl={splatUrl} scale={scale} controlsRef={controlsRef} />
        </Suspense>
      </Canvas>
      <SceneSelector />
    </>
  )
}

// Helper to get camera config based on scale
const getCameraConfig = (scale: 'small' | 'large') => {
  const isLarge = scale === 'large'
  return isLarge
    ? { position: [0, 100, 200] as [number, number, number], fov: 60, near: 0.1, far: 5000 }
    : { position: [0, 1.2, 2] as [number, number, number], fov: 60, near: 0.01, far: 100 }
}

// GL config for performance
const glConfig = {
  antialias: false,
  powerPreference: 'high-performance' as const,
  stencil: false,
  depth: true,
}

// Scene with externally controlled ref - memoized for performance
const GaussianSceneWithRef = memo(
  ({
    splatUrl,
    scale,
    controlsRef,
  }: {
    splatUrl: string
    scale: 'small' | 'large'
    controlsRef: React.RefObject<CameraControlsImpl | null>
  }) => {
    const isLarge = scale === 'large'
    // Dynamic speed based on scene scale
    const moveSpeed = isLarge ? 2.0 : 0.05

    // Use exact same keyboard controller as Tokyo PointLand
    useGaussianKeyboardController(controlsRef, moveSpeed)

    // Set initial camera with target very close - FPS style like LayerSpace
    useEffect(() => {
      const ctrl = controlsRef.current
      if (!ctrl) return

      // Lock distance between camera and target (FPS mode)
      ctrl.minDistance = 0.01
      ctrl.maxDistance = 0.5

      if (isLarge) {
        // NYC: start high looking forward
        ctrl.setLookAt(0, 100, 200, 0, 100, 199.5, false)
      } else {
        // Small scene: eye level
        ctrl.setLookAt(0, 1.2, 2, 0, 1.2, 1.5, false)
      }
    }, [controlsRef, isLarge])

    return (
      <>
        {/* Sky - adjusted for scene scale */}
        <Sky
          distance={isLarge ? 450000 : 1000}
          sunPosition={isLarge ? [100, 20, 100] : [5, 1, 8]}
          inclination={0.6}
          azimuth={0.25}
          rayleigh={isLarge ? 0.5 : 1}
          turbidity={isLarge ? 8 : 10}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
        {/* Rotate splat for coordinate system: Skyfall-GS uses Z-up, Three.js uses Y-up */}
        {/* Also flip Z axis with 180° Y rotation */}
        <group rotation={isLarge ? [-Math.PI / 2, Math.PI, 0] : [0, 0, 0]}>
          <Splat src={splatUrl} />
        </group>
        <CameraControls ref={controlsRef} makeDefault dollySpeed={0.5} truckSpeed={1.0} />
      </>
    )
  },
)

export const GaussianLand = ({ splatUrl }: GaussianLandProps) => {
  const sceneIndex = useUnit($gaussianSceneIndex)
  const currentScene = GAUSSIAN_SCENES[sceneIndex] || GAUSSIAN_SCENES[0]
  const currentUrl = splatUrl || currentScene.url
  const scale = currentScene.scale

  return (
    <div className="absolute inset-0 w-full h-full" style={{ background: '#1a1a2e' }}>
      <GaussianLandInner key={scale} splatUrl={currentUrl} scale={scale} />
    </div>
  )
}

export default GaussianLand
