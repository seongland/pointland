import { useEffect, useRef } from 'react'

interface Vector3 {
  x: number
  y: number
  z: number
}

interface Controls {
  getPosition: () => Vector3
  getTarget: () => Vector3
  setLookAt: (px: number, py: number, pz: number, tx: number, ty: number, tz: number, animate: boolean) => void
}

interface Space {
  controls: Controls
}

const MOVE_SPEED = 0.5

export const useKeyboardController = (space: Space | null) => {
  const keysPressed = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!space) return

    const keys = keysPressed.current

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      keys.add(e.code)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.code)
    }

    const updateMovement = () => {
      if (!space?.controls) {
        requestAnimationFrame(updateMovement)
        return
      }

      const controls = space.controls

      const hasMovement =
        keys.has('KeyW') || keys.has('KeyS') || keys.has('KeyA') || keys.has('KeyD') || keys.has('KeyE') || keys.has('KeyQ')

      if (!hasMovement) {
        requestAnimationFrame(updateMovement)
        return
      }

      const position = controls.getPosition()
      const target = controls.getTarget()

      // Calculate camera direction vectors
      const forward = {
        x: target.x - position.x,
        y: target.y - position.y,
        z: target.z - position.z,
      }
      const forwardLength = Math.sqrt(forward.x ** 2 + forward.y ** 2 + forward.z ** 2)
      if (forwardLength > 0) {
        forward.x /= forwardLength
        forward.y /= forwardLength
        forward.z /= forwardLength
      }

      // Right vector (perpendicular to forward)
      const right = {
        x: forward.y,
        y: -forward.x,
        z: 0,
      }
      const rightLength = Math.sqrt(right.x ** 2 + right.y ** 2)
      if (rightLength > 0) {
        right.x /= rightLength
        right.y /= rightLength
      }

      // Up vector (cross product of forward and right)
      const up = {
        x: forward.y * right.z - forward.z * right.y,
        y: forward.z * right.x - forward.x * right.z,
        z: forward.x * right.y - forward.y * right.x,
      }

      let moveX = 0
      let moveY = 0
      let moveZ = 0

      // WASD: camera-relative movement (includes Z!)
      if (keys.has('KeyW')) {
        moveX += forward.x * MOVE_SPEED
        moveY += forward.y * MOVE_SPEED
        moveZ += forward.z * MOVE_SPEED
      }
      if (keys.has('KeyS')) {
        moveX -= forward.x * MOVE_SPEED
        moveY -= forward.y * MOVE_SPEED
        moveZ -= forward.z * MOVE_SPEED
      }
      if (keys.has('KeyA')) {
        moveX -= right.x * MOVE_SPEED
        moveY -= right.y * MOVE_SPEED
        moveZ -= right.z * MOVE_SPEED
      }
      if (keys.has('KeyD')) {
        moveX += right.x * MOVE_SPEED
        moveY += right.y * MOVE_SPEED
        moveZ += right.z * MOVE_SPEED
      }

      // Q/E: camera-relative up/down (not world Z!)
      if (keys.has('KeyQ')) {
        moveX += up.x * MOVE_SPEED
        moveY += up.y * MOVE_SPEED
        moveZ += up.z * MOVE_SPEED
      }
      if (keys.has('KeyE')) {
        moveX -= up.x * MOVE_SPEED
        moveY -= up.y * MOVE_SPEED
        moveZ -= up.z * MOVE_SPEED
      }

      // Apply movement with animation for smoothness
      const newPosition = {
        x: position.x + moveX,
        y: position.y + moveY,
        z: position.z + moveZ,
      }
      const newTarget = {
        x: target.x + moveX,
        y: target.y + moveY,
        z: target.z + moveZ,
      }

      controls.setLookAt(newPosition.x, newPosition.y, newPosition.z, newTarget.x, newTarget.y, newTarget.z, true)

      requestAnimationFrame(updateMovement)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    requestAnimationFrame(updateMovement)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      keys.clear()
    }
  }, [space])
}
