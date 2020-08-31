import defaultSchema from "../abstract/default/default.schema"
const modelName = "users"

export default (app) => {
  const mongooseClient = app.get("mongooseClient")

  const userProperties = {
    email: { type: String, unique: true, lowercase: true },
    password: { type: String },

    given_name: { type: String, required: true },
    family_name: { type: String, required: true },
    profile_photo: { type: String },

    auth0Id: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    twitterId: { type: String },
    githubId: { type: String }
  }
  const userSchema = defaultSchema(app).add(userProperties)
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, userSchema)
}
