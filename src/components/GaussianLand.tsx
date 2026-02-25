import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Splat, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { useUnit } from 'effector-react'
import {
  $gaussianSceneIndex,
  $customSplatUrl,
  GAUSSIAN_SCENES,
  setGaussianSceneIndex,
  setCustomSplatUrl,
} from '@/store/model'

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

// Scene selector component with file upload
const SceneSelector = () => {
  const sceneIndex = useUnit($gaussianSceneIndex)
  const customUrl = useUnit($customSplatUrl)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setCustomSplatUrl(url)
      setGaussianSceneIndex(-1) // -1 means custom
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setCustomSplatUrl(urlInput.trim())
      setGaussianSceneIndex(-1)
      setShowUrlInput(false)
      setUrlInput('')
    }
  }

  const glassStyle = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: `
      0 8px 32px rgba(0,0,0,0.12),
      inset 0 1px 0 rgba(255,255,255,0.2),
      inset 0 -1px 0 rgba(0,0,0,0.1)
    `,
    backdropFilter: 'blur(20px)',
  }

  const activeStyle = {
    background: 'linear-gradient(135deg, rgba(200,100,255,0.3) 0%, rgba(200,100,255,0.15) 100%)',
    border: '1px solid rgba(200,100,255,0.4)',
    boxShadow: `
      0 8px 32px rgba(0,0,0,0.12),
      inset 0 1px 0 rgba(255,255,255,0.2),
      inset 0 -1px 0 rgba(0,0,0,0.1)
    `,
    backdropFilter: 'blur(20px)',
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {showUrlInput && (
        <div className="flex gap-2 items-center px-3 py-2 rounded-xl" style={glassStyle}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            placeholder="Enter .splat URL..."
            className="bg-transparent text-white/90 text-xs outline-none w-48 placeholder:text-white/50"
          />
          <button onClick={handleUrlSubmit} className="text-xs text-white/90 hover:text-white">
            Load
          </button>
          <button onClick={() => setShowUrlInput(false)} className="text-xs text-white/50 hover:text-white">
            Cancel
          </button>
        </div>
      )}
      <div className="flex gap-2 flex-wrap justify-center max-w-[90vw]">
        {GAUSSIAN_SCENES.map((scene, index) => (
          <button
            key={scene.name}
            onClick={() => {
              setGaussianSceneIndex(index)
              setCustomSplatUrl(null)
            }}
            className="group relative flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95"
            style={sceneIndex === index && !customUrl ? activeStyle : glassStyle}
          >
            <span className="text-xs font-medium text-white/90">{scene.name}</span>
          </button>
        ))}
        {/* Custom URL/File button */}
        <button
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="group relative flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          style={customUrl ? activeStyle : glassStyle}
        >
          <span className="text-xs font-medium text-white/90">URL</span>
        </button>
        {/* File upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          style={glassStyle}
        >
          <span className="text-xs font-medium text-white/90">Upload</span>
        </button>
        <input ref={fileInputRef} type="file" accept=".splat,.ply" onChange={handleFileUpload} className="hidden" />
      </div>
    </div>
  )
}

export const GaussianLand = ({ splatUrl }: GaussianLandProps) => {
  const sceneIndex = useUnit($gaussianSceneIndex)
  const customUrl = useUnit($customSplatUrl)

  // Priority: prop > custom URL > preset scene
  const currentUrl = splatUrl || customUrl || GAUSSIAN_SCENES[Math.max(0, sceneIndex)]?.url || GAUSSIAN_SCENES[0].url

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
