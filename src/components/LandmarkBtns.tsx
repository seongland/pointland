import { useEffect, useCallback } from 'react'
import { useUnit } from 'effector-react'
import { Crosshair } from 'lucide-react'
import { landmarks, Landmark, INITIAL_POSITION, INITIAL_TARGET } from '@/data/landmarks'
import { $layerspace } from '@/store/model'

export const LandmarkBtns = () => {
  const layerspace = useUnit($layerspace)

  const printCurrentPosition = useCallback(() => {
    if (!layerspace?.space?.controls) {
      console.log('Layerspace not ready')
      return
    }
    const controls = layerspace.space.controls
    const pos = controls.getPosition()
    const target = controls.getTarget()
    console.log('=== Current Camera Position ===')
    console.log(`Position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]`)
    console.log(`Target: [${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`)
    console.log('Copy for landmarks.ts:')
    console.log(`{
  name: 'LANDMARK_NAME',
  position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}],
  target: [${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}],
},`)
  }, [layerspace])

  const goToInitial = useCallback(() => {
    if (!layerspace?.space?.controls) return
    const controls = layerspace.space.controls
    console.log('Returning to initial position')
    controls.setLookAt(
      INITIAL_POSITION[0],
      INITIAL_POSITION[1],
      INITIAL_POSITION[2],
      INITIAL_TARGET[0],
      INITIAL_TARGET[1],
      INITIAL_TARGET[2],
      true,
    )
  }, [layerspace])

  const goToLandmark = useCallback(
    (index: number) => {
      console.log('goToLandmark called:', index, 'layerspace:', !!layerspace)
      if (!layerspace?.space?.controls) {
        console.log('Controls not available')
        return
      }
      const lm: Landmark = landmarks[index]
      const controls = layerspace.space.controls
      console.log('Moving to:', lm.name, 'position:', lm.position, 'target:', lm.target)
      controls.setLookAt(lm.position[0], lm.position[1], lm.position[2], lm.target[0], lm.target[1], lm.target[2], true)
    },
    [layerspace],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // P key to print position
      if (e.code === 'KeyP') {
        printCurrentPosition()
        return
      }
      // Space key to return to initial position (Tokyo Tower)
      if (e.code === 'Space') {
        e.preventDefault()
        goToInitial()
        return
      }
      const keyMap: Record<string, number> = {
        F1: 0,
        F2: 1,
        F3: 2,
        F4: 3,
        F5: 4,
      }
      if (keyMap[e.code] !== undefined) {
        e.preventDefault()
        goToLandmark(keyMap[e.code])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToLandmark, goToInitial, printCurrentPosition])

  if (!layerspace) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {/* Debug button to print current position - dev only */}
      {import.meta.env.DEV && (
        <button
          onClick={printCurrentPosition}
          className="group relative flex items-center gap-3 px-4 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(255,100,100,0.2) 0%, rgba(255,100,100,0.1) 100%)',
            border: '1px solid rgba(255,100,100,0.3)',
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.12),
              inset 0 1px 0 rgba(255,255,255,0.2),
              inset 0 -1px 0 rgba(0,0,0,0.1)
            `,
          }}
          aria-label="Print current position (P)"
        >
          <Crosshair className="w-5 h-5 text-red-300" />
          <span className="text-sm font-medium text-white/90">Print Pos (P)</span>
        </button>
      )}

      {landmarks.map((lm, i) => (
        <button
          key={lm.name}
          onClick={() => goToLandmark(i)}
          className="group relative flex items-center gap-3 px-4 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.12),
              inset 0 1px 0 rgba(255,255,255,0.2),
              inset 0 -1px 0 rgba(0,0,0,0.1)
            `,
          }}
          aria-label={`Go to ${lm.name}`}
        >
          <span
            className="flex items-center justify-center w-6 h-6 rounded-lg text-xs font-semibold text-white/90"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            F{i + 1}
          </span>
          <span className="text-sm font-medium text-white/90 whitespace-nowrap">{lm.name}</span>
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
            }}
          />
        </button>
      ))}
    </div>
  )
}

export default LandmarkBtns
