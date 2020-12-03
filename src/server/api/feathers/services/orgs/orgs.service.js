// Initializes the `orgs` service on path `/orgs`
import createModel from "./orgs.model"
import Organization from "./orgs.class"
import hooks from "./orgs.hooks"

export default (app) => {
  const options = {
    Model: createModel(app),
    paginate: false,
    id: "id"
  }

  // Initialize our service with any options it requires
  app.use("/orgs", new Organization(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service("orgs")
  app.use("/org", app.service("/orgs"))

  service.hooks(hooks)
}
