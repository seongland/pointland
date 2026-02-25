import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useUnit } from 'effector-react'
import { pageview } from './utils/analytics'
import { $loading, $viewerMode } from '@/store/model'
import { PointLand } from '@/components/PointLand'
import { GaussianLand } from '@/components/GaussianLand'
import { ViewerSwitch } from '@/components/ViewerSwitch'
import { HelpBtn } from '@/components/HelpBtn'
import { LandmarkBtns } from '@/components/LandmarkBtns'

const App = () => {
  const location = useLocation()
  const loading = useUnit($loading)
  const viewerMode = useUnit($viewerMode)

  useEffect(() => {
    pageview(location.pathname + location.search)
  }, [location])

  return (
    <div className="wrapper w-full h-full">
      <ViewerSwitch />
      {viewerMode === 'pointcloud' && <PointLand />}
      {viewerMode === 'gaussian' && <GaussianLand />}
      <HelpBtn />
      {viewerMode === 'pointcloud' && <LandmarkBtns />}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}

export default App
