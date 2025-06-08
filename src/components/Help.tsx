import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'

export const Help = () => {
  return (
    <Card className="shadow-2xl">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle>Pointland Usage</CardTitle>
      </CardHeader>

      <Accordion type="single" collapsible>
        <AccordionItem value="desktop">
          <AccordionTrigger>
            <CardTitle>Desktop</CardTitle>
          </AccordionTrigger>
          <AccordionContent>
            <Separator />
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Desktop Move Shortcuts</h3>
              <div className="space-y-2">
                <p><kbd className="px-2 py-1 bg-muted rounded">w</kbd> - Move front</p>
                <p><kbd className="px-2 py-1 bg-muted rounded">a</kbd> - Move left</p>
                <p><kbd className="px-2 py-1 bg-muted rounded">s</kbd> - Move right</p>
                <p><kbd className="px-2 py-1 bg-muted rounded">d</kbd> - Move back</p>
                <p><kbd className="px-2 py-1 bg-muted rounded">q</kbd> - Move down</p>
                <p><kbd className="px-2 py-1 bg-muted rounded">e</kbd> - Move up</p>
              </div>

              <h3 className="text-sm font-medium text-muted-foreground">Desktop See Shortcuts</h3>
              <div className="space-y-2">
                <p><kbd className="px-2 py-1 bg-muted rounded">↑</kbd> - See up</p>
                <p><kbd className="px-2 py-1 bg-muted rounded">←</kbd> - See left</p>
                <p><kbd className="px-2 py-1 bg-muted rounded">↓</kbd> - See down</p>
                <p><kbd className="px-2 py-1 bg-muted rounded">→</kbd> - See right</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mobile">
          <AccordionTrigger>
            <CardTitle>Mobile</CardTitle>
          </AccordionTrigger>
          <AccordionContent>
            <Separator />
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Mobile Move</h3>
              <div className="space-y-2">
                <p><kbd className="px-2 py-1 bg-muted rounded">Left Bottom Area</kbd> - XY Plane Movement</p>
                <p><kbd className="px-2 py-1 bg-muted rounded">Right Bottom Area</kbd> - Rotate Camera</p>
                <p><kbd className="px-2 py-1 bg-muted rounded">Top Left Area</kbd> - Fast XY Plane Movement</p>
                <p><kbd className="px-2 py-1 bg-muted rounded">Top Right Area</kbd> - XZ Plane Movement</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

export default Help
