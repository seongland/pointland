import { useEffect, useState, useCallback } from 'react'
import { useUnit } from 'effector-react'
import { Check } from 'lucide-react'
import { landmarks, Landmark } from '@/data/landmarks'
import { $layerspace } from '@/store/model'

export const LandmarkBtns = () => {
  const layerspace = useUnit($layerspace)
  const [visited, setVisited] = useState<Set<number>>(new Set())

  const goToLandmark = useCallback(
    (index: number) => {
      if (!layerspace?.space?.controls) return
      const lm: Landmark = landmarks[index]
      const controls = layerspace.space.controls
      controls.setLookAt(lm.position[0], lm.position[1], lm.position[2], lm.target[0], lm.target[1], lm.target[2], true)
      setVisited((prev) => new Set([...prev, index]))
    },
    [layerspace],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [goToLandmark])

  if (!layerspace) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
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
          {visited.has(i) && (
            <Check className="w-4 h-4 text-emerald-400 ml-auto transition-all duration-300" strokeWidth={2.5} />
          )}
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
