// Initializes the `spaces` service on path `/spaces`
import createModel from "./spaces.model"
import Spaces from "./spaces.class"
import hooks from "./spaces.hooks"

export default (app) => {
  const options = {
    Model: createModel(app),
    paginate: false,
    id: "id"
  }

  // Initialize our service with any options it requires
  app.use("/spaces", new Spaces(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service("spaces")
  app.use("/space", app.service("/spaces"))

  service.hooks(hooks)
}
