import defaultSchema from "../abstract/default/default.schema"
import orgSchema from "./innerSchema/org"
import userSchema from "./innerSchema/user"
import layerSchema from "./innerSchema/layer"
const modelName = "projects"

export default (app) => {
  const mongooseClient = app.get("mongooseClient")

  const projectProperties = {
    users: { type: [userSchema], required: true, default: undefined },
    orgs: { type: [orgSchema], required: true, default: undefined },
    name: { type: String, required: true },
    layers: { type: layerSchema }
  }
  const projectSchema = defaultSchema(app).add(projectProperties)
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, projectSchema)
}
