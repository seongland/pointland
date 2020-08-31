/**
 * @summary - Collection Model Making function file by parameter to express app
 */

import recursiveSchema from "../abstract/recursive/recursive.schema"
import schemeSchema from "./innerSchema/scheme"

const modelName = "collections"
const collectionProperties = {
  scheme: { type: Map, of: schemeSchema },
  sub_views: { type: [String], default: undefined },
  main_view: { type: String, default: undefined }
}

export default (app) => {
  const mongooseClient = app.get("mongooseClient")

  // Collection Meta Properties

  const collectionSchema = recursiveSchema(app).add(collectionProperties)

  if (mongooseClient.modelNames().includes(modelName))
    mongooseClient.deleteModel(modelName)
  return mongooseClient.model(modelName, collectionSchema)
}
