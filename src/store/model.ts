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

// Events
export const setLoading = createEvent<boolean>()
export const showSnackbar = createEvent<Partial<SnackbarMessage>>()
export const setState = createEvent<{ props: string[]; value: unknown }>()
export const setLayerspace = createEvent<LayerSpaceInstance | null>()

// Stores
export const $loading = createStore(false).on(setLoading, (_, value) => value)
export const $layerspace = createStore<LayerSpaceInstance | null>(null).on(setLayerspace, (_, value) => value)

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
