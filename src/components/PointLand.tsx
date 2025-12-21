import { useEffect, useRef } from 'react'
import { usePointland } from '@/hooks/usePointland'
import { useController } from '@/hooks/useController'

export const PointLand = () => {
  const { touchable, checkTouchable } = useController()
  const { startLand } = usePointland()
  const pointlandRef = useRef<HTMLDivElement>(null)
  const nippleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pointlandRef.current) {
      // @ts-expect-error LayerSpace type mismatch
      startLand(pointlandRef.current).then((layerspace) => {
        if (layerspace) {
          checkTouchable(layerspace.space)
        }
      })
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
