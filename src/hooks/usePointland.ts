import { useCallback } from 'react'
import LayerSpace from 'layerspace'
import { useUnit } from 'effector-react'
import { $loading, setLoading, showSnackbar } from '@/store/model'

interface SpaceOptions {
  id: string
  layers: { point: unknown[] }
  box: string
  position: number[]
  callback: {
    click: (...args: unknown[]) => void
    make: (...args: unknown[]) => void
  }
  potree: {
    budget: number
  }
}

// Tokyo Tower position - same as INITIAL in landmarks.ts
const POSITION = [18.62, 128.11, 52.57]
const TARGET = [18.53, 128.13, 52.54]

// PCO and Space types from layerspace library
interface PCO {
  position: { x: number; y: number; z: number }
  translateX: (x: number) => void
  translateY: (y: number) => void
  translateZ: (z: number) => void
  material: {
    intensityRange: number[]
    maxSize: number
    minSize: number
    size: number
    shape: number
    rgbBrightness: number
    rgbContrast: number
  }
}

interface Space {
  offset: number[]
  pointclouds: PCO[]
  scene: { add: (pco: PCO) => void }
  controls: {
    setTarget: (x: number, y: number, z: number, animate: boolean) => void
    rotateTo: (azimuth: number, polar: number, animate: boolean) => void
  }
}

export const usePointland = () => {
  useUnit($loading)

  const loadPCO = useCallback((pco: PCO, space: Space) => {
    setLoading(false)
    space.offset = [pco.position.x, pco.position.y, pco.position.z]
    pco.translateX(-pco.position.x)
    pco.translateY(-pco.position.y)
    pco.translateZ(-pco.position.z)
    const initialPosition = [8700, 3900, 255]
    pco.translateX(-initialPosition[0])
    pco.translateY(-initialPosition[1])
    pco.translateZ(-initialPosition[2])
    space.pointclouds.push(pco)
    space.scene.add(pco)
    pco.material.intensityRange = [0, 255]
    pco.material.maxSize = 40
    pco.material.minSize = 4
    pco.material.size = 1
    pco.material.shape = 1
    pco.material.rgbBrightness = 0.05
    pco.material.rgbContrast = 0.25
    space.controls.setTarget(TARGET[0], TARGET[1], TARGET[2], true)
    return space
  }, [])

  const startLand = useCallback(
    (target: HTMLElement) => {
      if (!target) return null

      setLoading(true)

      const spaceOpt: SpaceOptions = {
        id: 'pointland',
        layers: { point: [] },
        box: 'skybox',
        position: POSITION,
        callback: {
          click: (...args) => {
            console.debug(args)
          },
          make: (...args) => {
            console.debug(args)
          },
        },
        potree: {
          budget: 10000000,
        },
      }

      const layerspace = new LayerSpace(target, spaceOpt)
      const space = layerspace.space

      setTimeout(() => {
        showSnackbar({ message: 'Welcome to Pointland' })
      }, 1000)

      // Always use relative path - Vite dev server and Vercel rewrites handle the proxy
      return space.potree
        .loadPointCloud('cloud.js', (url: string) => `/tokyo-potree/${url}`)
        .then((pco) => loadPCO(pco, space))
        .then(() => {
          return layerspace
        })
        .catch((error) => {
          console.error('Failed to load pointcloud:', error)
          setLoading(false)
          return null
        })
    },
    [loadPCO],
  )

  return { startLand }
}
