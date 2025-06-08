declare module 'layerspace' {
  interface LayerSpaceOptions {
    callback?: {
      click?: (...args: any[]) => void
      make?: (...args: any[]) => void
    }
    potree?: {
      budget?: number
    }
  }

  interface Space {
    potree: {
      loadPointCloud: (path: string, urlResolver: (url: string) => string) => Promise<any>
    }
    controls: {
      rotateTo: (x: number, y: number, animate: boolean) => void
      setTarget: (x: number, y: number, z: number, animate: boolean) => void
      rotate: (x: number, y: number, z: boolean) => void
      truck: (x: number, y: number, z: boolean) => void
      forward: (distance: number, animate: boolean) => void
    }
    pointclouds: any[]
    scene: {
      add: (object: any) => void
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