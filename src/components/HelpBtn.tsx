import { useState } from 'react'

export const HelpBtn = () => {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg">
        <h2 className="text-xl mb-2">Pointland Usage</h2>
        
        <div className="mb-4">
          <h3 className="text-lg mb-1">Desktop Move Shortcuts</h3>
          <ul className="space-y-1">
            <li>w - Move front</li>
            <li>a - Move left</li>
            <li>s - Move right</li>
            <li>d - Move back</li>
            <li>q - Move down</li>
            <li>e - Move up</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg mb-1">Desktop See Shortcuts</h3>
          <ul className="space-y-1">
            <li>↑ - See up</li>
            <li>← - See left</li>
            <li>↓ - See down</li>
            <li>→ - See right</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HelpBtn
