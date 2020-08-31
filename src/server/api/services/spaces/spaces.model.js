import recursiveSchema from "../abstract/recursive/recursive.schema"
const modelName = "spaces"

export default (app) => {
  const mongooseClient = app.get("mongooseClient")
  const spaceProperties = {
    name: { type: String, required: true, default: undefined },
    domain: { type: String, required: true, default: undefined, unique: true },
    icon: { type: String, default: undefined },
    shard_id: { type: Number, default: undefined },
    sub_views: { type: [String], default: undefined },
    main_view: { type: String, default: undefined }
  }
  const spaceSchema = recursiveSchema(app).add(spaceProperties)

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, spaceSchema)
}
