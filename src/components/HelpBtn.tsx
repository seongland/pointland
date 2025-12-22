import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Help } from '@/components/Help'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export const HelpBtn = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Help button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="fixed top-4 left-4 z-50 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:scale-105 hover:shadow-lg transition-all duration-200 flex items-center justify-center text-lg font-medium cursor-pointer shadow-md border border-gray-200/50"
            aria-label="Help"
          >
            ?
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
          <VisuallyHidden>
            <DialogTitle>Pointland Help</DialogTitle>
            <DialogDescription>Navigation controls for Pointland</DialogDescription>
          </VisuallyHidden>
          <Help />
        </DialogContent>
      </Dialog>

      {/* Source info footer */}
      <div className="fixed bottom-4 left-4 z-50 text-white text-sm">
        <span>This pointcloud source is from </span>
        <a
          href="https://3dview.tokyo-digitaltwin.metro.tokyo.lg.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-300"
        >
          City of Tokyo
        </a>
      </div>
    </>
  )
}

export default HelpBtn
