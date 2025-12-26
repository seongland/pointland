import { useEffect, useRef } from 'react'
import { usePointland } from '@/hooks/usePointland'
import { useController } from '@/hooks/useController'
import { setLayerspace } from '@/store/model'

interface LayerSpaceInstance {
  space: {
    dispose: () => void
    renderer: { domElement: HTMLCanvasElement }
  }
}

export const PointLand = () => {
  const { touchable, checkTouchable } = useController()
  const { startLand } = usePointland()
  const pointlandRef = useRef<HTMLDivElement>(null)
  const nippleRef = useRef<HTMLDivElement>(null)
  const layerspaceRef = useRef<LayerSpaceInstance | null>(null)
  const controllerCleanupRef = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    let isMounted = true

    if (pointlandRef.current) {
      // @ts-expect-error LayerSpace type mismatch
      startLand(pointlandRef.current).then((layerspace) => {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {touchable && <div ref={nippleRef} id="nipple" className="absolute w-full h-full overflow-hidden z-10" />}
      <div ref={pointlandRef} id="pointland" className="absolute w-full h-full" />
    </div>
  )
}

export default PointLand
