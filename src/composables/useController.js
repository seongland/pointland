import { reactive, toRefs, ref } from '@vue/composition-api'
import nipplejs from 'nipplejs'

export default function useController() {
  const controller = reactive({})
  const touchable = ref(true)

  function checkTouchable(space) {
    touchable.value = true
    const zone = document.getElementById('nipple')
    if (!zone) return
    const options = { zone, multitouch: true, maxNumberOfNipples: 2 }
    const manager = nipplejs.create(options)
    nippleEvent(manager, space)
  }

  function nippleEvent(manager, space) {
    manager.on('added', (_, nipple) => {
      if (nipple.position.y < window.innerHeight / 2) verticalNipple(nipple, space)
      else if (nipple.position.x < window.innerWidth / 2) cameraNipple(nipple, space)
      else targetNipple(nipple, space)
    })
  }

  function cameraNipple(nipple, space) {
    let loop
    let factor = 1
    nipple.on('move', (_, data) => {
      if (loop) clearInterval(loop)
      loop = setInterval(() => {
        space.controls.truck((data.force * data.vector.x) / 10, 0, false)
        space.controls.forward((data.force * data.vector.y) / 10, false)
        data.vector.x /= factor
        data.vector.y /= factor
      }, 10)
    })
    nipple.on('end', () => (factor = 1.1))
    nipple.on('destroyed', () => loop && clearInterval(loop))
  }

  function verticalNipple(nipple, space) {
    let loop
    let factor = 1
    nipple.on('move', (_, data) => {
      if (loop) clearInterval(loop)
      loop = setInterval(() => {
        space.controls.truck(0, -(data.force * data.vector.y) / 10, false)
        data.vector.x /= factor
        data.vector.y /= factor
      }, 10)
    })
    nipple.on('end', () => (factor = 1.1))
    nipple.on('destroyed', () => loop && clearInterval(loop))
  }
  function targetNipple(nipple, space) {
    let loop
    let factor = 1
    nipple.on('move', (_, data) => {
      if (loop) clearInterval(loop)
      loop = setInterval(() => {
        space.controls.rotate(-(data.force * data.vector.x) / 200, (data.force * data.vector.y) / 200, false)
        data.vector.x /= factor
        data.vector.y /= factor
      }, 10)
    })
    nipple.on('end', () => (factor = 1.1))
    nipple.on('destroyed', () => loop && clearInterval(loop))
  }

  return { checkTouchable, controller: toRefs(controller), touchable }
}
