import defaultSchema from "../abstract/default/default.schema"
import projectSchema from "./innerSchema/project"
import userSchema from "./innerSchema/user"
const modelName = "orgs"

export default (app) => {
  const mongooseClient = app.get("mongooseClient")
  const orgProperties = {
    domain: { type: String, required: true, default: undefined },
    users: { type: [userSchema], required: true, default: undefined },
    projects: { type: [projectSchema], default: [] },
    name: { type: String, required: true, unique: true },
  }
  const orgSchema = defaultSchema(app).add(orgProperties)

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, orgSchema)
}
