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

  export interface Vector3 {
    x: number
    y: number
    z: number
  }

  /** A loaded point cloud object, as potree resolves it. */
  export interface PCO {
    position: Vector3
    translateX: (x: number) => void
    translateY: (y: number) => void
    translateZ: (z: number) => void
    material: {
      intensityRange: number[]
      maxSize: number
      minSize: number
      size: number
      shape: number
      rgbBrightness: number
      rgbContrast: number
    }
  }

  export interface Space {
    potree: {
      loadPointCloud: (path: string, urlResolver: (url: string) => string) => Promise<PCO>
    }
    controls: {
      rotateTo: (x: number, y: number, animate: boolean) => void
      setTarget: (x: number, y: number, z: number, animate: boolean) => void
      rotate: (x: number, y: number, z: boolean) => void
      truck: (x: number, y: number, z: boolean) => void
      forward: (distance: number, animate: boolean) => void
      setLookAt: (px: number, py: number, pz: number, tx: number, ty: number, tz: number, animate: boolean) => void
      getPosition: () => Vector3
      getTarget: () => Vector3
      addEventListener: (event: string, callback: () => void) => void
      removeEventListener: (event: string, callback: () => void) => void
    }
    pointclouds: PCO[]
    scene: {
      add: (object: PCO) => void
    }
    offset: number[]
    camera: {
      position: Vector3
    }
    renderer: { domElement: HTMLCanvasElement }
    dispose: () => void
  }

  export class LayerSpace {
    constructor(target: HTMLElement, options?: LayerSpaceOptions)
    space: Space
  }

  export default LayerSpace
}
