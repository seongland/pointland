import { useUnit } from 'effector-react'
import { $viewerMode, setViewerMode, ViewerMode } from '@/store/model'

export const ViewerSwitch = () => {
  const viewerMode = useUnit($viewerMode)

  const handleSwitch = (mode: ViewerMode) => {
    setViewerMode(mode)
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
      <button
        onClick={() => handleSwitch('pointcloud')}
        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95"
        style={{
          background:
            viewerMode === 'pointcloud'
              ? 'linear-gradient(135deg, rgba(100,200,255,0.3) 0%, rgba(100,200,255,0.15) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          border: viewerMode === 'pointcloud' ? '1px solid rgba(100,200,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `,
        }}
      >
        <svg className="w-4 h-4 text-white/90" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="4" cy="4" r="2" />
          <circle cx="12" cy="4" r="2" />
          <circle cx="20" cy="4" r="2" />
          <circle cx="4" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="20" cy="12" r="2" />
          <circle cx="4" cy="20" r="2" />
          <circle cx="12" cy="20" r="2" />
          <circle cx="20" cy="20" r="2" />
        </svg>
        <span className="text-sm font-medium text-white/90">Point Cloud</span>
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          }}
        />
      </button>

      <button
        onClick={() => handleSwitch('gaussian')}
        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95"
        style={{
          background:
            viewerMode === 'gaussian'
              ? 'linear-gradient(135deg, rgba(200,100,255,0.3) 0%, rgba(200,100,255,0.15) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          border: viewerMode === 'gaussian' ? '1px solid rgba(200,100,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `,
        }}
      >
        <svg className="w-4 h-4 text-white/90" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fillOpacity="0.3" />
          <circle cx="12" cy="12" r="6" fillOpacity="0.5" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="text-sm font-medium text-white/90">Gaussian</span>
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          }}
        />
      </button>
    </div>
  )
}

export default ViewerSwitch
