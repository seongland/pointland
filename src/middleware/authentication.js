export default function ({ store, route, params, redirect }) {
  if (
    !store.state.localStorage.accessToken &&
    route.name !== "index" && route.name !== "signup"
  )
    return redirect("/")
  else if (store.state.localStorage.accessToken && !params.space)
    return redirect(`/map`)
}
