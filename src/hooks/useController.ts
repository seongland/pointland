import { useState, useEffect, useCallback } from 'react'
import nipplejs, { JoystickManager, JoystickOutputData, EventData, JoystickManagerOptions } from 'nipplejs'
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
  const [dirControl, setDirControl] = useState<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const [xyControl, setXyControl] = useState<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const [zControl, setZControl] = useState<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const [mouse, setMouse] = useState<Vector>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY })
    }
    document.addEventListener('mousemove', handleMouseMove, false)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const nippleEvent = useCallback((manager: JoystickManager, space: Space) => {
    manager.on('added', (evt: EventData, data: JoystickOutputData) => {
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
  }, [])

  const dirNipple = useCallback((nipple: NippleJoystick, space: Space) => {
    const holder = new ElementHold(nipple.el, 10)
    holder._holdStart()
    holder.addEventListener('holding', (event: HoldEvent) => {
      space.controls.rotate(
        (-(dirControl.force * dirControl.vector.x) * event.deltaTime) / 2000,
        (dirControl.force * dirControl.vector.y * event.deltaTime) / 2000,
        true
      )
    })
    nipple.on('move', (_, data: JoystickOutputData) => {
      setDirControl({ force: data.force, vector: data.vector })
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      setDirControl({ force: 0, vector: { x: 0, y: 0 } })
      console.debug(space.offset, space.camera.position)
    })
  }, [dirControl])

  const fastxyNipple = useCallback((nipple: NippleJoystick, space: Space) => {
    const holder = new ElementHold(nipple.el, 10)
    holder._holdStart()
    holder.addEventListener('holding', (event: HoldEvent) => {
      space.controls.truck((xyControl.force * xyControl.vector.x) * event.deltaTime, 0, true)
      space.controls.forward((xyControl.force * xyControl.vector.y) * event.deltaTime, true)
    })
    nipple.on('move', (_, data: JoystickOutputData) => {
      setXyControl({ force: data.force, vector: data.vector })
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      setXyControl({ force: 0, vector: { x: 0, y: 0 } })
    })
  }, [xyControl])

  const zNipple = useCallback((nipple: NippleJoystick, space: Space) => {
    const holder = new ElementHold(nipple.el, 10)
    holder._holdStart()
    holder.addEventListener('holding', (event: HoldEvent) => {
      space.controls.truck((zControl.force * zControl.vector.x / 100) * event.deltaTime, 0, true)
      space.controls.truck(0, -(zControl.force * zControl.vector.y / 100) * event.deltaTime, true)
    })
    nipple.on('move', (_, data: JoystickOutputData) => {
      setZControl({ force: data.force, vector: data.vector })
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      setZControl({ force: 0, vector: { x: 0, y: 0 } })
    })
  }, [zControl])

  const xyNipple = useCallback((nipple: NippleJoystick, space: Space) => {
    const holder = new ElementHold(nipple.el, 10)
    holder._holdStart()
    holder.addEventListener('holding', (event: HoldEvent) => {
      space.controls.truck((xyControl.force * xyControl.vector.x / 10) * event.deltaTime, 0, true)
      space.controls.forward((xyControl.force * xyControl.vector.y / 10) * event.deltaTime, true)
    })
    nipple.on('move', (_, data: JoystickOutputData) => {
      setXyControl({ force: data.force, vector: data.vector })
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      setXyControl({ force: 0, vector: { x: 0, y: 0 } })
    })
  }, [xyControl])

  const checkTouchable = useCallback((space: Space) => {
    setTouchable(true)
    let manager: JoystickManager | null = null
    
    // Wait for nipple element to be available
    setTimeout(() => {
      const zone = document.getElementById('nipple')
      if (!zone) {
        console.error('Nipple zone not found')
        return
      }
      
      try {
        const options: JoystickManagerOptions = { 
          zone, 
          multitouch: true, 
          maxNumberOfNipples: 2,
          position: { top: '50%', left: '50%' },
          mode: 'dynamic' as const
        }
        manager = nipplejs.create(options)
        nippleEvent(manager, space)
      } catch (error) {
        console.error('Failed to create nipple:', error)
      }
    }, 100)

    // Cleanup function
    return () => {
      if (manager) {
        manager.destroy()
      }
      setTouchable(false)
    }
  }, [nippleEvent])

  return {
    checkTouchable,
    direction: dirControl,
    xy: xyControl,
    z: zControl,
    touchable,
    mouse
  }
} 