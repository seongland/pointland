import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Splat, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { useUnit } from 'effector-react'
import { $gaussianSceneIndex, GAUSSIAN_SCENES, setGaussianSceneIndex } from '@/store/model'

interface GaussianLandProps {
  splatUrl?: string
}

// Camera-relative WASD movement controller with target tracking
const KeyboardControls = ({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) => {
  const { camera } = useThree()
  const keys = useRef<Set<string>>(new Set())
  const MOVE_SPEED = 0.05

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      keys.current.add(e.code)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.code)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useFrame(() => {
    const k = keys.current
    if (!k.has('KeyW') && !k.has('KeyS') && !k.has('KeyA') && !k.has('KeyD') && !k.has('KeyQ') && !k.has('KeyE')) return

    // Get camera direction (forward vector) - includes Y for flying movement
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)

    // Right vector (perpendicular to forward)
    const right = new THREE.Vector3()
    right.crossVectors(forward, camera.up).normalize()

    // Up vector (camera relative)
    const up = new THREE.Vector3()
    up.crossVectors(right, forward).normalize()

    // Calculate movement delta
    const delta = new THREE.Vector3()

    if (k.has('KeyW')) delta.addScaledVector(forward, MOVE_SPEED)
    if (k.has('KeyS')) delta.addScaledVector(forward, -MOVE_SPEED)
    if (k.has('KeyA')) delta.addScaledVector(right, -MOVE_SPEED)
    if (k.has('KeyD')) delta.addScaledVector(right, MOVE_SPEED)
    if (k.has('KeyQ')) delta.addScaledVector(up, -MOVE_SPEED)
    if (k.has('KeyE')) delta.addScaledVector(up, MOVE_SPEED)

    // Move both camera and OrbitControls target
    camera.position.add(delta)
    if (controlsRef.current) {
      controlsRef.current.target.add(delta)
    }
  })

  return null
}

// Scene content with controls
const GaussianScene = ({ splatUrl }: { splatUrl: string }) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const { camera } = useThree()

  // Initialize target very close to camera for first-person feel
  useEffect(() => {
    if (controlsRef.current) {
      const forward = new THREE.Vector3(0, 0, -1)
      forward.applyQuaternion(camera.quaternion)
      controlsRef.current.target.copy(camera.position).add(forward.multiplyScalar(0.1))
    }
  }, [camera])

  return (
    <>
      <color attach="background" args={['#1a1a2e']} />
      <Splat src={splatUrl} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan
        enableZoom
        enableRotate
        enableDamping
        dampingFactor={0.05}
        minDistance={0.01}
        maxDistance={0.5}
      />
      <KeyboardControls controlsRef={controlsRef} />
    </>
  )
}

// Scene selector component
const SceneSelector = () => {
  const sceneIndex = useUnit($gaussianSceneIndex)

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 flex-wrap justify-center max-w-[90vw]">
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

export const GaussianLand = ({ splatUrl }: GaussianLandProps) => {
  const sceneIndex = useUnit($gaussianSceneIndex)
  const currentUrl = splatUrl || GAUSSIAN_SCENES[sceneIndex]?.url || GAUSSIAN_SCENES[0].url

  return (
    <div className="absolute inset-0 w-full h-full" style={{ background: '#1a1a2e' }}>
      <Canvas camera={{ position: [0, 1.2, 2], fov: 60, near: 0.01, far: 100 }}>
        <GaussianScene splatUrl={currentUrl} />
      </Canvas>
      <SceneSelector />
    </div>
  )
}

export default GaussianLand
