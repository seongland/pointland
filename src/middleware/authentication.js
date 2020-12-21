export default function({ store, route, _, redirect }) {
  if (!store.state.ls.accessToken && route.name !== 'login' && route.name !== 'signup') return redirect('/login')
  else if (store.state.ls.accessToken && (route.name === 'login' || route.name === 'signup')) return redirect(`/`)
}
