import { createStore, createEvent, createEffect } from 'effector'
import type LayerSpace from 'layerspace'

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

// The shape lives in src/types/layerspace.d.ts. It used to be re-declared here
// and in PointLand.tsx, and the three copies disagreed about which methods a
// Space has, which is what the casts and the ts-expect-error were papering over.
export type LayerSpaceInstance = LayerSpace

// Gaussian splat viewer. The shapes here are the ones GaussianLand.tsx and
// ViewerSwitch.tsx already read; nothing is invented beyond what they use.
export type ViewerMode = 'pointcloud' | 'gaussian'

export interface GaussianScene {
  name: string
  url: string
  scale: 'small' | 'large'
}

/**
 * The splat itself is 75MB, which is bucket territory rather than git, so it is
 * served from public/ locally and needs the same treatment as the potree data
 * (see the /tokyo-potree rewrite in vercel.json) before this ships.
 */
export const GAUSSIAN_SCENES: GaussianScene[] = [{ name: 'NYC', url: '/NYC_004_final.splat', scale: 'large' }]

// Events

export const setLoading = createEvent<boolean>()
export const showSnackbar = createEvent<Partial<SnackbarMessage>>()
export const setState = createEvent<{ props: string[]; value: unknown }>()
export const setLayerspace = createEvent<LayerSpaceInstance | null>()
export const setViewerMode = createEvent<ViewerMode>()
export const setGaussianSceneIndex = createEvent<number>()

// Stores
export const $loading = createStore(false).on(setLoading, (_, value) => value)
export const $layerspace = createStore<LayerSpaceInstance | null>(null).on(setLayerspace, (_, value) => value)
export const $viewerMode = createStore<ViewerMode>('pointcloud').on(setViewerMode, (_, value) => value)
export const $gaussianSceneIndex = createStore(0).on(setGaussianSceneIndex, (_, value) => value)

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
