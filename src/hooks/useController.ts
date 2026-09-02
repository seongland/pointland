import { useState, useEffect, useCallback, useRef } from 'react'
import nipplejs from 'nipplejs'
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

/**
 * nipplejs 1.x hands every listener a single event object and nothing else.
 * The 0.x signature this file was written against was `(evt, data)`, so the
 * ported code read an argument that is now always undefined, and the guard in
 * nippleEvent then returned before a joystick was ever wired up. nipplejs does
 * not export its types, so the parts we touch are declared here.
 */
interface NippleEvent<T> {
  type: string
  data: T
}

/** `evt.data` on a 'move'. */
interface JoystickMove {
  force: number
  vector: Vector
}

/** `evt.data` on 'added'. The element moved from `el` to `ui.el` in 1.x. */
interface Joystick {
  position: Vector
  ui: { el: HTMLElement }
  on(event: 'move', callback: (evt: NippleEvent<JoystickMove>) => void): void
  on(event: 'removed', callback: (evt: NippleEvent<Joystick>) => void): void
}

interface JoystickManager {
  on(event: 'added', callback: (evt: NippleEvent<Joystick>) => void): void
  destroy(): void
}

export const useController = () => {
  const [touchable, setTouchable] = useState(true)
  const [dirControl, setDirControl] = useState<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const [xyControl, setXyControl] = useState<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const [zControl, setZControl] = useState<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const [mouse, setMouse] = useState<Vector>({ x: 0, y: 0 })

  // The hold loop reads these every frame. React state is a render behind, so
  // the value it steers by is written straight to a ref as the move arrives.
  const dirControlRef = useRef(dirControl)
  const xyControlRef = useRef(xyControl)
  const zControlRef = useRef(zControl)

  const setDir = useCallback((control: Control) => {
    dirControlRef.current = control
    setDirControl(control)
  }, [])
  const setXy = useCallback((control: Control) => {
    xyControlRef.current = control
    setXyControl(control)
  }, [])
  const setZ = useCallback((control: Control) => {
    zControlRef.current = control
    setZControl(control)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY })
    }
    document.addEventListener('mousemove', handleMouseMove, false)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const dirNipple = useCallback(
    (nipple: Joystick, space: Space) => {
      const holder = new ElementHold(nipple.ui.el, 10)
      holder._holdStart()
      holder.addEventListener('holding', (event: HoldEvent) => {
        const ctrl = dirControlRef.current
        space.controls.rotate(
          (-(ctrl.force * ctrl.vector.x) * event.deltaTime) / 2000,
          (ctrl.force * ctrl.vector.y * event.deltaTime) / 2000,
          true,
        )
      })
      nipple.on('move', (evt) => setDir({ force: evt.data.force, vector: evt.data.vector }))
      nipple.on('removed', () => {
        holder._holdEnd()
        setDir({ force: 0, vector: { x: 0, y: 0 } })
      })
    },
    [setDir],
  )

  const fastxyNipple = useCallback(
    (nipple: Joystick, space: Space) => {
      const holder = new ElementHold(nipple.ui.el, 10)
      holder._holdStart()
      holder.addEventListener('holding', (event: HoldEvent) => {
        const ctrl = xyControlRef.current
        space.controls.truck(ctrl.force * ctrl.vector.x * event.deltaTime, 0, true)
        space.controls.forward(ctrl.force * ctrl.vector.y * event.deltaTime, true)
      })
      nipple.on('move', (evt) => setXy({ force: evt.data.force, vector: evt.data.vector }))
      nipple.on('removed', () => {
        holder._holdEnd()
        setXy({ force: 0, vector: { x: 0, y: 0 } })
      })
    },
    [setXy],
  )

  const zNipple = useCallback(
    (nipple: Joystick, space: Space) => {
      const holder = new ElementHold(nipple.ui.el, 10)
      holder._holdStart()
      holder.addEventListener('holding', (event: HoldEvent) => {
        const ctrl = zControlRef.current
        space.controls.truck(((ctrl.force * ctrl.vector.x) / 100) * event.deltaTime, 0, true)
        space.controls.truck(0, -((ctrl.force * ctrl.vector.y) / 100) * event.deltaTime, true)
      })
      nipple.on('move', (evt) => setZ({ force: evt.data.force, vector: evt.data.vector }))
      nipple.on('removed', () => {
        holder._holdEnd()
        setZ({ force: 0, vector: { x: 0, y: 0 } })
      })
    },
    [setZ],
  )

  const xyNipple = useCallback(
    (nipple: Joystick, space: Space) => {
      const holder = new ElementHold(nipple.ui.el, 10)
      holder._holdStart()
      holder.addEventListener('holding', (event: HoldEvent) => {
        const ctrl = xyControlRef.current
        space.controls.truck(((ctrl.force * ctrl.vector.x) / 10) * event.deltaTime, 0, true)
        space.controls.forward(((ctrl.force * ctrl.vector.y) / 10) * event.deltaTime, true)
      })
      nipple.on('move', (evt) => setXy({ force: evt.data.force, vector: evt.data.vector }))
      nipple.on('removed', () => {
        holder._holdEnd()
        setXy({ force: 0, vector: { x: 0, y: 0 } })
      })
    },
    [setXy],
  )

  const nippleEvent = useCallback(
    (manager: JoystickManager, space: Space) => {
      manager.on('added', (evt) => {
        const nipple = evt.data
        if (!nipple?.position) return

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
    },
    [dirNipple, fastxyNipple, xyNipple, zNipple],
  )

  const checkTouchable = useCallback(
    (space: Space) => {
      setTouchable(true)
      let manager: JoystickManager | null = null

      const zone = document.getElementById('nipple')
      if (!zone) {
        console.error('Nipple zone not found')
        return
      }

      try {
        // maxNumberOfNipples was renamed in 1.x and the old key is ignored,
        // which silently raises the cap to the default ten.
        manager = nipplejs.create({
          zone,
          mode: 'dynamic',
          multitouch: true,
          maxNumberOfJoysticks: 2,
        }) as unknown as JoystickManager
        nippleEvent(manager, space)
      } catch (error) {
        console.error('Failed to create nipple:', error)
      }

      return () => {
        if (manager) manager.destroy()
        setTouchable(false)
      }
    },
    [nippleEvent],
  )

  return {
    checkTouchable,
    direction: dirControl,
    xy: xyControl,
    z: zControl,
    touchable,
    mouse,
  }
}
