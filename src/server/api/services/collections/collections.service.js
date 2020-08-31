// Initializes the `Collections` service on path `/collections`
import createModel from "./collections.model"
import Collections from "./collections.class"
import hooks from "./collections.hooks"

export default (app) => {
  const options = {
    Model: createModel(app),
    paginate: false,
    id: "id"
  }

  // Initialize our service with any options it requires
  app.use("/collections", new Collections(options, app))
  app.use("/collection", app.service("/collections"))

  // Get our initialized service so that we can register hooks
  const service = app.service("collections")
  service.hooks(hooks)
}
