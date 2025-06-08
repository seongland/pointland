import { createStore } from 'vuex'

interface SnackbarMessage {
  message: string
  color: string
  timeout: number
}

interface Snackbar {
  messages: SnackbarMessage[]
  open?: boolean
}

interface RootState {
  loading: boolean
  snackbar: Snackbar
}

export default createStore<RootState>({
  state: {
    loading: false,
    snackbar: { messages: [] },
  },
  mutations: {
    setLoading(state: RootState, value: boolean): void {
      state.loading = value
    },
    snack(state: RootState, { message = 'Success', color = 'darkgrey', timeout = 2000 }: Partial<SnackbarMessage>): void {
      const msgObj: SnackbarMessage = { message, color, timeout }
      state.snackbar.open = true
      state.snackbar.messages.push(msgObj)
    },
    setState(state: RootState, { props, value }: { props: string[], value: any }): void {
      let target: any = state
      for (const i in props) {
        if (Number(i) === props.length - 1) {
          target[props[i]] = value
        } else {
          target = target[props[i]]
        }
      }
    },
  },
})
