import { useState, useEffect, useRef } from 'react'
import nipplejs, { JoystickManager, JoystickOutputData, EventData } from 'nipplejs'
import { ElementHold } from 'hold-event'

interface Vector {
  x: number
  y: number
}

interface Control {
  force: number
  vector: Vector
}

interface Space {
  controls: {
    rotate: (x: number, y: number, z: boolean) => void
    truck: (x: number, y: number, z: boolean) => void
    forward: (distance: number, animate: boolean) => void
  }
  offset: number[]
  camera: {
    position: { x: number; y: number; z: number }
  }
}

interface HoldEvent {
  deltaTime: number
}

// Extend the nipplejs types since they're incomplete
interface NippleJoystick extends JoystickOutputData {
  on(event: 'move' | 'destroyed', callback: (evt: EventData, data: JoystickOutputData) => void): void
  el: HTMLElement
  position: {
    x: number
    y: number
  }
  destroy(): void
}

export const useController = () => {
  const [touchable, setTouchable] = useState(true)
  const [mouse, setMouse] = useState<Vector>({ x: 0, y: 0 })

  // Use refs for control values to avoid stale closure issues
  const dirControlRef = useRef<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const xyControlRef = useRef<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const zControlRef = useRef<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const managerRef = useRef<JoystickManager | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY })
    }
    document.addEventListener('mousemove', handleMouseMove, false)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const checkTouchable = (space: Space) => {
    // Destroy existing manager if any
    if (managerRef.current) {
      managerRef.current.destroy()
      managerRef.current = null
    }

    setTouchable(true)

    const zone = document.getElementById('nipple')
    if (!zone) return

    // Exact same options as original Vue code
    const options = { zone, multitouch: true, maxNumberOfNipples: 2 }
    const manager = nipplejs.create(options)
    managerRef.current = manager

    manager.on('added', (_: EventData, data: JoystickOutputData) => {
      const nipple = data as unknown as NippleJoystick
      if (!nipple || !nipple.position) return

      if (nipple.position.x < window.innerWidth / 2 && nipple.position.y < window.innerHeight / 2) {
        fastxyNipple(nipple, space)
      } else if (nipple.position.y < window.innerHeight / 2) {
        zNipple(nipple, space)
      } else if (nipple.position.x < window.innerWidth / 2) {
        xyNipple(nipple, space)
      } else {
        dirNipple(nipple, space)
      }
    })
  }

  const dirNipple = (nipple: NippleJoystick, space: Space) => {
    const holder = new ElementHold(nipple.el, 10)
    holder._holdStart()
    holder.addEventListener('holding', (event: HoldEvent) => {
      const ctrl = dirControlRef.current
      space.controls.rotate(
        (-(ctrl.force * ctrl.vector.x) * event.deltaTime) / 2000,
        (ctrl.force * ctrl.vector.y * event.deltaTime) / 2000,
        true,
      )
    })
    nipple.on('move', (_: EventData, data: JoystickOutputData) => {
      dirControlRef.current = { force: data.force, vector: data.vector }
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      dirControlRef.current = { force: 0, vector: { x: 0, y: 0 } }
      console.debug(space.offset, space.camera.position)
    })
  }

  const fastxyNipple = (nipple: NippleJoystick, space: Space) => {
    const holder = new ElementHold(nipple.el, 10)
    holder._holdStart()
    holder.addEventListener('holding', (event: HoldEvent) => {
      const ctrl = xyControlRef.current
      space.controls.truck(ctrl.force * ctrl.vector.x * event.deltaTime, 0, true)
      space.controls.forward(ctrl.force * ctrl.vector.y * event.deltaTime, true)
    })
    nipple.on('move', (_: EventData, data: JoystickOutputData) => {
      xyControlRef.current = { force: data.force, vector: data.vector }
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      xyControlRef.current = { force: 0, vector: { x: 0, y: 0 } }
    })
  }

  const zNipple = (nipple: NippleJoystick, space: Space) => {
    const holder = new ElementHold(nipple.el, 10)
    holder._holdStart()
    holder.addEventListener('holding', (event: HoldEvent) => {
      const ctrl = zControlRef.current
      space.controls.truck(((ctrl.force * ctrl.vector.x) / 100) * event.deltaTime, 0, true)
      space.controls.truck(0, -((ctrl.force * ctrl.vector.y) / 100) * event.deltaTime, true)
    })
    nipple.on('move', (_: EventData, data: JoystickOutputData) => {
      zControlRef.current = { force: data.force, vector: data.vector }
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      zControlRef.current = { force: 0, vector: { x: 0, y: 0 } }
    })
  }

  const xyNipple = (nipple: NippleJoystick, space: Space) => {
    const holder = new ElementHold(nipple.el, 10)
    holder._holdStart()
    holder.addEventListener('holding', (event: HoldEvent) => {
      const ctrl = xyControlRef.current
      space.controls.truck(((ctrl.force * ctrl.vector.x) / 10) * event.deltaTime, 0, true)
      space.controls.forward(((ctrl.force * ctrl.vector.y) / 10) * event.deltaTime, true)
    })
    nipple.on('move', (_: EventData, data: JoystickOutputData) => {
      xyControlRef.current = { force: data.force, vector: data.vector }
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      xyControlRef.current = { force: 0, vector: { x: 0, y: 0 } }
    })
  }

  return {
    checkTouchable,
    direction: dirControlRef.current,
    xy: xyControlRef.current,
    z: zControlRef.current,
    touchable,
    mouse,
  }
}
