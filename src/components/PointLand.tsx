import { useEffect, useRef, useState } from 'react'
import { usePointland } from '@/hooks/usePointland'
import { useController } from '@/hooks/useController'
import { useKeyboardController } from '@/hooks/useKeyboardController'
import { setLayerspace } from '@/store/model'
import type LayerSpace from 'layerspace'
import type { Space } from 'layerspace'

export const PointLand = () => {
  const { touchable, checkTouchable } = useController()
  const { startLand } = usePointland()
  const pointlandRef = useRef<HTMLDivElement>(null)
  const nippleRef = useRef<HTMLDivElement>(null)
  const layerspaceRef = useRef<LayerSpace | null>(null)
  const controllerCleanupRef = useRef<(() => void) | undefined>(undefined)
  const [spaceForKeyboard, setSpaceForKeyboard] = useState<Space | null>(null)

  useKeyboardController(spaceForKeyboard)

  useEffect(() => {
    let isMounted = true

    if (pointlandRef.current) {
      startLand(pointlandRef.current)?.then((layerspace) => {
        if (!isMounted) {
          // Component unmounted before promise resolved - clean up immediately
          if (layerspace) {
            layerspace.space.dispose()
            const canvas = layerspace.space.renderer.domElement
            if (canvas.parentNode) {
              canvas.parentNode.removeChild(canvas)
            }
          }
          return
        }
        if (layerspace) {
          layerspaceRef.current = layerspace
          setLayerspace(layerspace)
          setSpaceForKeyboard(layerspace.space)
          controllerCleanupRef.current = checkTouchable(layerspace.space)
        }
      })
    }

    return () => {
      isMounted = false
      if (controllerCleanupRef.current) controllerCleanupRef.current()
      if (layerspaceRef.current) {
        layerspaceRef.current.space.dispose()
        const canvas = layerspaceRef.current.space.renderer.domElement
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas)
        }
        layerspaceRef.current = null
      }
      setLayerspace(null)
      setSpaceForKeyboard(null)
    }
  }, [])

  return (
    <div>
      {touchable && <div ref={nippleRef} id="nipple" className="absolute w-full h-full overflow-hidden z-10" />}
      <div ref={pointlandRef} id="pointland" className="absolute w-full h-full" />
    </div>
  )
}

export default PointLand
