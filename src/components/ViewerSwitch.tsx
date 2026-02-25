import { useUnit } from 'effector-react'
import { $viewerMode, setViewerMode, ViewerMode } from '@/store/model'
import { Button } from '@/components/ui/button'

export const ViewerSwitch = () => {
  const viewerMode = useUnit($viewerMode)

  const handleSwitch = (mode: ViewerMode) => {
    setViewerMode(mode)
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
      <Button
        variant={viewerMode === 'pointcloud' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleSwitch('pointcloud')}
        className="text-xs"
      >
        Point Cloud
      </Button>
      <Button
        variant={viewerMode === 'gaussian' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleSwitch('gaussian')}
        className="text-xs"
      >
        Gaussian Splat
      </Button>
    </div>
  )
}

export default ViewerSwitch
