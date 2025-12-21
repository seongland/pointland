import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Help } from '@/components/Help'

export const HelpBtn = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Help button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all flex items-center justify-center text-xl font-bold cursor-pointer"
            aria-label="Help"
          >
            ?
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
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
