import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

const Key = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 text-xs font-mono text-zinc-200 bg-zinc-800 rounded border border-zinc-700">
    {children}
  </span>
)

const Shortcut = ({ keys, action }: { keys: string; action: string }) => (
  <div className="flex items-center gap-3">
    <Key>{keys}</Key>
    <span className="text-sm text-zinc-300">{action}</span>
  </div>
)

export const Help = () => {
  return (
    <div className="w-full max-w-md bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800">
        <h2 className="text-base font-semibold text-white">Pointland Usage</h2>
      </div>

      {/* Accordion Content */}
      <Accordion type="single" collapsible defaultValue="desktop" className="w-full">
        <AccordionItem value="desktop" className="border-b border-zinc-800">
          <AccordionTrigger className="px-6 py-4 text-white hover:bg-zinc-800/50 hover:no-underline">
            Desktop
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-6">
              <div>
                <div className="text-sm font-medium text-zinc-400 mb-3">Movement</div>
                <div className="grid grid-cols-2 gap-3">
                  <Shortcut keys="W" action="Forward" />
                  <Shortcut keys="S" action="Backward" />
                  <Shortcut keys="A" action="Left" />
                  <Shortcut keys="D" action="Right" />
                  <Shortcut keys="Q" action="Down" />
                  <Shortcut keys="E" action="Up" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-400 mb-3">Camera</div>
                <div className="grid grid-cols-2 gap-3">
                  <Shortcut keys="↑" action="Look up" />
                  <Shortcut keys="↓" action="Look down" />
                  <Shortcut keys="←" action="Look left" />
                  <Shortcut keys="→" action="Look right" />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mobile" className="border-0">
          <AccordionTrigger className="px-6 py-4 text-white hover:bg-zinc-800/50 hover:no-underline">
            Mobile
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="text-sm font-medium text-zinc-400 mb-3">Touch Zones</div>
            <div className="grid grid-cols-2 gap-3">
              <Shortcut keys="TL" action="Fast XY" />
              <Shortcut keys="TR" action="XZ Move" />
              <Shortcut keys="BL" action="XY Move" />
              <Shortcut keys="BR" action="Rotate" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default Help
