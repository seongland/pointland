import { createStore, createEvent, createEffect } from 'effector'

// Types
interface SnackbarMessage {
  message: string
  color: string
  timeout: number
}

interface Snackbar {
  messages: SnackbarMessage[]
  open: boolean
}

// Layerspace type
export interface LayerSpaceInstance {
  space: {
    controls: {
      setLookAt: (px: number, py: number, pz: number, tx: number, ty: number, tz: number, animate: boolean) => void
      getPosition: () => { x: number; y: number; z: number }
      getTarget: () => { x: number; y: number; z: number }
      setTarget: (x: number, y: number, z: number, animate: boolean) => void
      rotateTo: (azimuth: number, polar: number, animate: boolean) => void
      addEventListener: (event: string, callback: () => void) => void
      removeEventListener: (event: string, callback: () => void) => void
    }
  }
}

// Viewer mode type
export type ViewerMode = 'pointcloud' | 'gaussian'

// Events
export const setLoading = createEvent<boolean>()
export const showSnackbar = createEvent<Partial<SnackbarMessage>>()
export const setState = createEvent<{ props: string[]; value: unknown }>()
export const setLayerspace = createEvent<LayerSpaceInstance | null>()
export const setViewerMode = createEvent<ViewerMode>()

// Stores
export const $loading = createStore(false).on(setLoading, (_, value) => value)
export const $layerspace = createStore<LayerSpaceInstance | null>(null).on(setLayerspace, (_, value) => value)
export const $viewerMode = createStore<ViewerMode>('pointcloud').on(setViewerMode, (_, value) => value)

export const $snackbar = createStore<Snackbar>({ messages: [], open: false }).on(showSnackbar, (state, payload) => {
  const msgObj: SnackbarMessage = {
    message: payload.message || 'Success',
    color: payload.color || 'darkgrey',
    timeout: payload.timeout || 2000,
  }
  return {
    messages: [...state.messages, msgObj],
    open: true,
  }
})

// Effects for async operations
export const setStateEffect = createEffect(async ({ props, value }: { props: string[]; value: unknown }) => {
  let target: Record<string, unknown> = {}
  for (const i in props) {
    if (Number(i) === props.length - 1) {
      target[props[i]] = value
    } else {
      target = target[props[i]] as Record<string, unknown>
    }
  }
  return target
})
