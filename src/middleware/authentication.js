const beforeList = ["index", "signup"]

export default function ({ store, route, _, redirect }) {
  if (process.server) return
  console.log(store.state, route.name)
  if (
    !store.state.localStorage.accessToken &&
    route.name !== "index" &&
    route.name !== "signup"
  )
    return redirect("/")
  else if (store.state.localStorage.accessToken &&
    (route.name === "index" || route.name === "signup"))
    return redirect(`/map`)
}
