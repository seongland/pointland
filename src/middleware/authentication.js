const beforeList = ["index", "signup"]

export default function ({ store, route, _, redirect }) {
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
