import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Splat, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'

const DEFAULT_SPLAT_URL = 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat'

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

  return (
    <>
      <color attach="background" args={['#1a1a2e']} />
      <Splat src={splatUrl} />
      <OrbitControls ref={controlsRef} makeDefault enablePan enableZoom enableRotate enableDamping dampingFactor={0.05} />
      <KeyboardControls controlsRef={controlsRef} />
    </>
  )
}

export const GaussianLand = ({ splatUrl = DEFAULT_SPLAT_URL }: GaussianLandProps) => {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ background: '#1a1a2e' }}>
      <Canvas camera={{ position: [0, 1.2, 2], fov: 60, near: 0.01, far: 100 }}>
        <GaussianScene splatUrl={splatUrl} />
      </Canvas>
    </div>
  )
}

export default GaussianLand
