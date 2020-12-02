import createModel from "./users.model"
import Users from "./users.class"
import hooks from "./users.hooks"

export default (app) => {
  const options = {
    Model: createModel(app),
    paginate: false,
    id: "id"
  }

  // Initialize our service with any options it requires
  app.use("/users", new Users(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service("users")
  app.use("/user", app.service("/users"))

  service.hooks(hooks)
}
