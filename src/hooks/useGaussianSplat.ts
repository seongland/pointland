import { useCallback } from 'react'
import * as THREE from 'three'
import { SplatMesh } from '@sparkjsdev/spark'
import { setLoading, showSnackbar } from '@/store/model'

// Sample splat URLs for POC
const SAMPLE_SPLAT_URL = 'https://sparkjs.dev/assets/splats/garden.spz'

// Default camera position (similar to PointLand)
const DEFAULT_POSITION = new THREE.Vector3(0, 2, 10)
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0)

export interface GaussianSpace {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: {
    rotate: (x: number, y: number) => void
    truck: (x: number, y: number) => void
    forward: (distance: number) => void
  }
  dispose: () => void
}

export const useGaussianSplat = () => {
  const startGaussian = useCallback((container: HTMLElement): Promise<GaussianSpace | null> => {
    if (!container) return Promise.resolve(null)

    setLoading(true)

    // Create Three.js scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)

    // Create camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.copy(DEFAULT_POSITION)
    camera.lookAt(DEFAULT_TARGET)

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // Camera control state
    let azimuthAngle = 0
    let polarAngle = Math.PI / 2
    const distance = DEFAULT_POSITION.length()

    // Simple orbit-like controls
    const controls = {
      rotate: (x: number, y: number) => {
        azimuthAngle += x
        polarAngle = Math.max(0.1, Math.min(Math.PI - 0.1, polarAngle + y))
        updateCameraPosition()
      },
      truck: (x: number, y: number) => {
        const right = new THREE.Vector3()
        const up = new THREE.Vector3(0, 1, 0)
        camera.getWorldDirection(right)
        right.cross(up).normalize()
        camera.position.addScaledVector(right, x * 0.1)
        camera.position.y += y * 0.1
      },
      forward: (dist: number) => {
        const direction = new THREE.Vector3()
        camera.getWorldDirection(direction)
        camera.position.addScaledVector(direction, dist * 0.1)
      },
    }

    const updateCameraPosition = () => {
      const x = distance * Math.sin(polarAngle) * Math.cos(azimuthAngle)
      const y = distance * Math.cos(polarAngle)
      const z = distance * Math.sin(polarAngle) * Math.sin(azimuthAngle)
      camera.position.set(x, y, z)
      camera.lookAt(DEFAULT_TARGET)
    }

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    // Dispose function
    const dispose = () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      scene.clear()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }

    // Load splat mesh with LoD for scalable rendering (like Potree)
    // lod: true enables automatic Level-of-Detail for large scenes
    const splatMesh = new SplatMesh({
      url: SAMPLE_SPLAT_URL,
      lod: true, // Enable LoD for scalable rendering
    })
    splatMesh.position.set(0, 0, 0)
    scene.add(splatMesh)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Start animation loop
    animate()

    setLoading(false)
    showSnackbar({ message: 'Gaussian Splat loaded' })

    return Promise.resolve({
      scene,
      camera,
      renderer,
      controls,
      dispose,
    })
  }, [])

  return { startGaussian }
}
