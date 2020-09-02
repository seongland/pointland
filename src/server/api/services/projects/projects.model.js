import defaultSchema from "../abstract/default/default.schema"
import orgSchema from "./innerSchema/org"
import userSchema from "./innerSchema/user"
const modelName = "users"

export default (app) => {
  const mongooseClient = app.get("mongooseClient")

  const projectProperties = {
    users: { type: [userSchema], required: true, default: undefined },
    orgs: { type: [userSchema], required: true, default: undefined }
  }
  const projectSchema = defaultSchema(app).add(projectProperties)
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, projectSchema)
}
