import recursiveSchema from "../abstract/recursive/recursive.schema"
import projectSchema from "./innerSchema/project"
const modelName = "orgs"

export default (app) => {
  const mongooseClient = app.get("mongooseClient")
  const orgProperties = {
    domain: { type: String, required: true, default: undefined },
    projects: { type: [projectSchema], default: [] },
    name: { type: String, required: true },
  }
  const orgSchema = recursiveSchema(app).add(orgProperties)

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, orgSchema)
}
