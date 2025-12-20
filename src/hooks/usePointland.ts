import { useCallback } from 'react'
import LayerSpace from 'layerspace'
import { useUnit } from 'effector-react'
import { $loading, setLoading, showSnackbar } from '@/store/model'

interface SpaceOptions {
  callback: {
    click: (...args: any[]) => void
    make: (...args: any[]) => void
  }
  potree: {
    budget: number
  }
}

const POSITION = [10, 130, 50]
const EPS = 1e-5

export const usePointland = () => {
  const loading = useUnit($loading)

  const loadPCO = useCallback((pco: any, space: any) => {
    setLoading(false)
    space.offset = [pco.position.x, pco.position.y, pco.position.z]
    pco.translateX(-pco.position.x)
    pco.translateY(-pco.position.y)
    pco.translateZ(-pco.position.z)
    const initialPosition = [8700, 3900, 255]
    pco.translateX(-initialPosition[0])
    pco.translateY(-initialPosition[1])
    pco.translateZ(-initialPosition[2])
    const initialRotation = [3, 1.178]
    space.pointclouds.push(pco)
    space.scene.add(pco)
    pco.material.intensityRange = [0, 255]
    pco.material.maxSize = 40
    pco.material.minSize = 4
    pco.material.size = 1
    pco.material.shape = 1
    pco.material.rgbBrightness = 0.05
    pco.material.rgbContrast = 0.25
    // Set camera position immediately, then animate to final view
    space.controls.setTarget(POSITION[0] + 7 * EPS, POSITION[1] - 1 * EPS, POSITION[2] - EPS, false)
    space.controls.rotateTo(initialRotation[0], initialRotation[1], true)
    return space
  }, [])

  const startLand = useCallback((target: HTMLElement) => {
    if (!target) return null
    
    setLoading(true)

    const spaceOpt: SpaceOptions = {
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
      }
    }
    
    const layerspace = new LayerSpace(target, spaceOpt)
    const space = layerspace.space

    setTimeout(() => {
      showSnackbar({ message: 'Welcome to Pointland' })
    }, 1000)
    
    // Always use relative path - Vite dev server and Vercel rewrites handle the proxy
    return space.potree.loadPointCloud('cloud.js', (url: string) => `/tokyo-potree/${url}`)
      .then((pco) => loadPCO(pco, space))
      .then(() => {
        return layerspace
      })
      .catch((error) => {
        console.error('Failed to load pointcloud:', error)
        setLoading(false)
        return null
      })

  }, [loadPCO])

  return { startLand }
} 