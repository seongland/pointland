declare module 'layerspace' {
  interface LayerSpaceOptions {
    callback?: {
      click?: (...args: unknown[]) => void
      make?: (...args: unknown[]) => void
    }
    potree?: {
      budget?: number
    }
  }

  interface Space {
    potree: {
      loadPointCloud: (path: string, urlResolver: (url: string) => string) => Promise<unknown>
    }
    controls: {
      rotateTo: (x: number, y: number, animate: boolean) => void
      setTarget: (x: number, y: number, z: number, animate: boolean) => void
      rotate: (x: number, y: number, z: boolean) => void
      truck: (x: number, y: number, z: boolean) => void
      forward: (distance: number, animate: boolean) => void
    }
    pointclouds: unknown[]
    scene: {
      add: (object: unknown) => void
    }
    offset: number[]
    camera: {
      position: { x: number; y: number; z: number }
    }
  }

  class LayerSpace {
    constructor(target: HTMLElement, options?: LayerSpaceOptions)
    space: Space
  }

  export default LayerSpace
}
