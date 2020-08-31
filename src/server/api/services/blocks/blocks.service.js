import createModel from "./blocks.model"
import Blocks from "./blocks.class"
import hooks from "./blocks.hooks"

export default (app) => {
  // Multi doc control, set id index
  const options = {
    Model: createModel(app),
    paginate: false,
    multi: true,
    id: "id"
  }

  // Connect CRUD service to Blocks Object
  app.use("/blocks", new Blocks(options, app))
  app.use("/block", app.service("/blocks"))
  const service = app.service("blocks")
  service.hooks(hooks)
}
