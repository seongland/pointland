import createModel from "./projects.model"
import Projects from "./projects.class"
import hooks from "./projects.hooks"

export default (app) => {
  const options = {
    Model: createModel(app),
    paginate: false,
    id: "id"
  }

  // Initialize our service with any options it requires
  app.use("/projects", new Projects(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service("projects")
  app.use("/project", app.service("/projects"))

  service.hooks(hooks)
}
