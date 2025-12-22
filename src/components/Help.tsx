import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded border border-gray-200 shadow-sm">
    {children}
  </kbd>
)

export const Help = () => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 max-w-md w-full">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-gray-900 to-gray-800">
        <h2 className="text-lg font-semibold text-white tracking-tight">Pointland Usage</h2>
        <p className="text-gray-400 text-sm mt-1">Navigate the 3D point cloud</p>
      </div>

      {/* Content */}
      <Accordion type="single" collapsible defaultValue="desktop" className="px-2 py-2">
        <AccordionItem value="desktop" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-medium text-gray-900">Desktop Controls</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Movement</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Kbd>W</Kbd> <span>Forward</span></div>
                  <div className="flex items-center gap-2"><Kbd>S</Kbd> <span>Backward</span></div>
                  <div className="flex items-center gap-2"><Kbd>A</Kbd> <span>Left</span></div>
                  <div className="flex items-center gap-2"><Kbd>D</Kbd> <span>Right</span></div>
                  <div className="flex items-center gap-2"><Kbd>Q</Kbd> <span>Down</span></div>
                  <div className="flex items-center gap-2"><Kbd>E</Kbd> <span>Up</span></div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Camera</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Kbd>↑</Kbd> <span>Look up</span></div>
                  <div className="flex items-center gap-2"><Kbd>↓</Kbd> <span>Look down</span></div>
                  <div className="flex items-center gap-2"><Kbd>←</Kbd> <span>Look left</span></div>
                  <div className="flex items-center gap-2"><Kbd>→</Kbd> <span>Look right</span></div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mobile" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-medium text-gray-900">Mobile Controls</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Touch Zones</h4>
              <div className="grid gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">BL</div>
                  <span>Bottom Left - XY Movement</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">BR</div>
                  <span>Bottom Right - Rotate Camera</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">TL</div>
                  <span>Top Left - Fast XY Movement</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">TR</div>
                  <span>Top Right - XZ Movement</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default Help
