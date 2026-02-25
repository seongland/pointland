import { useEffect, useRef, useState } from 'react'
import { useGaussianSplat, GaussianSpace } from '@/hooks/useGaussianSplat'
import { useController } from '@/hooks/useController'
import { useKeyboardController } from '@/hooks/useKeyboardController'

export const GaussianLand = () => {
  const { touchable, checkTouchable } = useController()
  const { startGaussian } = useGaussianSplat()
  const containerRef = useRef<HTMLDivElement>(null)
  const nippleRef = useRef<HTMLDivElement>(null)
  const gaussianSpaceRef = useRef<GaussianSpace | null>(null)
  const controllerCleanupRef = useRef<(() => void) | undefined>(undefined)
  const [spaceForKeyboard, setSpaceForKeyboard] = useState<GaussianSpace | null>(null)

  // Adapt GaussianSpace controls to match the interface expected by useKeyboardController
  const adaptedSpace = spaceForKeyboard
    ? {
        controls: {
          rotate: spaceForKeyboard.controls.rotate,
          truck: spaceForKeyboard.controls.truck,
          forward: spaceForKeyboard.controls.forward,
        },
        offset: [0, 0, 0],
        camera: {
          position: {
            x: spaceForKeyboard.camera.position.x,
            y: spaceForKeyboard.camera.position.y,
            z: spaceForKeyboard.camera.position.z,
          },
        },
      }
    : null

  useKeyboardController(adaptedSpace)

  useEffect(() => {
    let isMounted = true

    if (containerRef.current) {
      startGaussian(containerRef.current).then((space) => {
        if (!isMounted) {
          if (space) {
            space.dispose()
          }
          return
        }
        if (space) {
          gaussianSpaceRef.current = space
          setSpaceForKeyboard(space)
          // Setup touch controls with adapted space interface
          const adaptedForController = {
            controls: space.controls,
            offset: [0, 0, 0],
            camera: {
              position: {
                x: space.camera.position.x,
                y: space.camera.position.y,
                z: space.camera.position.z,
              },
            },
          }
          controllerCleanupRef.current = checkTouchable(adaptedForController)
        }
      })
    }

    return () => {
      isMounted = false
      if (controllerCleanupRef.current) controllerCleanupRef.current()
      if (gaussianSpaceRef.current) {
        gaussianSpaceRef.current.dispose()
        gaussianSpaceRef.current = null
      }
      setSpaceForKeyboard(null)
    }
  }, [])

  return (
    <div>
      {touchable && <div ref={nippleRef} id="nipple" className="absolute w-full h-full overflow-hidden z-10" />}
      <div ref={containerRef} id="gaussianland" className="absolute w-full h-full" />
    </div>
  )
}

export default GaussianLand
