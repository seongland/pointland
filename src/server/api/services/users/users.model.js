import defaultSchema from "../abstract/default/default.schema"
import projectSchema from "./innerSchema/project"
import orgSchema from "./innerSchema/org"
const modelName = "users"

export default (app) => {
  const mongooseClient = app.get("mongooseClient")

  const userProperties = {
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
    profile_photo: { type: String },
    name: { type: String, required: true },
    projects: { type: [projectSchema], default: [] },
    org: { type: orgSchema, required: true },
  }
  const userSchema = defaultSchema(app).add(userProperties)
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, userSchema)
}
