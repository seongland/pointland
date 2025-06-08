import { reactive, toRefs, ref } from 'vue'
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

export default function useController() {
  const mouse = reactive<Vector>({ x: 0, y: 0 })
  document.addEventListener(
    'mousemove',
    (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    },
    false
  )
  const dirControl = reactive<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const xyControl = reactive<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const zControl = reactive<Control>({ force: 0, vector: { x: 0, y: 0 } })
  const touchable = ref<boolean>(true)

  function checkTouchable(space: Space): void {
    touchable.value = true
    const zone = document.getElementById('nipple')
    if (!zone) return
    const options = { zone, multitouch: true, maxNumberOfNipples: 2 }
    const manager = nipplejs.create(options)
    nippleEvent(manager, space)
  }

  function nippleEvent(manager: JoystickManager, space: Space): void {
    manager.on('added', (evt: EventData, data: JoystickOutputData) => {
      const nipple = data as unknown as NippleJoystick
      if (nipple.position.x < window.innerWidth / 2 && nipple.position.y < window.innerHeight / 2) fastxyNipple(nipple, space)
      else if (nipple.position.y < window.innerHeight / 2) zNipple(nipple, space)
      else if (nipple.position.x < window.innerWidth / 2) xyNipple(nipple, space)
      else dirNipple(nipple, space)
    })
  }

  function dirNipple(nipple: NippleJoystick, space: Space): void {
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
      dirControl.force = data.force
      dirControl.vector = data.vector
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      dirControl.force = 0
      dirControl.vector = { x: 0, y: 0 }
      console.debug(space.offset, space.camera.position)
    })
  }
  
  function fastxyNipple(nipple: NippleJoystick, space: Space): void {
    const holder = new ElementHold(nipple.el, 10)
    holder._holdStart()
    holder.addEventListener('holding', (event: HoldEvent) => {
      space.controls.truck((xyControl.force * xyControl.vector.x) * event.deltaTime, 0, true)
      space.controls.forward((xyControl.force * xyControl.vector.y) * event.deltaTime, true)
    })
    nipple.on('move', (_, data: JoystickOutputData) => {
      xyControl.force = data.force
      xyControl.vector = data.vector
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      xyControl.force = 0
      xyControl.vector = { x: 0, y: 0 }
    })
  }

  function zNipple(nipple: NippleJoystick, space: Space): void {
    const holder = new ElementHold(nipple.el, 10)
    holder._holdStart()
    holder.addEventListener('holding', (event: HoldEvent) => {
      space.controls.truck((zControl.force * zControl.vector.x / 100) * event.deltaTime, 0, true)
      space.controls.truck(0, -(zControl.force * zControl.vector.y / 100) * event.deltaTime, true)
    })
    nipple.on('move', (_, data: JoystickOutputData) => {
      zControl.force = data.force
      zControl.vector = data.vector
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      zControl.force = 0
      zControl.vector = { x: 0, y: 0 }
    })
  }

  function xyNipple(nipple: NippleJoystick, space: Space): void {
    const holder = new ElementHold(nipple.el, 10)
    holder._holdStart()
    holder.addEventListener('holding', (event: HoldEvent) => {
      space.controls.truck((xyControl.force * xyControl.vector.x / 10) * event.deltaTime, 0, true)
      space.controls.forward((xyControl.force * xyControl.vector.y / 10) * event.deltaTime, true)
    })
    nipple.on('move', (_, data: JoystickOutputData) => {
      xyControl.force = data.force
      xyControl.vector = data.vector
    })
    nipple.on('destroyed', () => {
      holder._holdEnd()
      xyControl.force = 0
      xyControl.vector = { x: 0, y: 0 }
    })
  }

  return {
    checkTouchable,
    direction: toRefs(dirControl),
    xy: toRefs(xyControl),
    z: toRefs(zControl),
    touchable,
  }
} 