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

// Events
export const setLoading = createEvent<boolean>()
export const showSnackbar = createEvent<Partial<SnackbarMessage>>()
export const setState = createEvent<{ props: string[]; value: any }>()

// Stores
export const $loading = createStore(false)
  .on(setLoading, (_, value) => value)

export const $snackbar = createStore<Snackbar>({ messages: [], open: false })
  .on(showSnackbar, (state, payload) => {
    const msgObj: SnackbarMessage = {
      message: payload.message || 'Success',
      color: payload.color || 'darkgrey',
      timeout: payload.timeout || 2000
    }
    return {
      messages: [...state.messages, msgObj],
      open: true
    }
  })

// Effects for async operations
export const setStateEffect = createEffect(async ({ props, value }: { props: string[]; value: any }) => {
  let target: any = {}
  for (const i in props) {
    if (Number(i) === props.length - 1) {
      target[props[i]] = value
    } else {
      target = target[props[i]]
    }
  }
  return target
})
