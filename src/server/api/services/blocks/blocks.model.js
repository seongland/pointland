/**
 * @summary - Block Model maker function file by parameter to express app
 */

import recursiveSchema from "../abstract/recursive/recursive.schema"
import querySchema from "./innerSchema/query"

const modelName = "blocks"
const blockProperties = {
  type: { type: String, required: true, default: "text" },

  // for collection_view not for content
  collection_id: { type: String, default: undefined },
  query: { type: querySchema, default: undefined },

  // for space_view not for content
  space_id: { type: String, default: undefined }
}

export default (app) => {
  const mongooseClient = app.get("mongooseClient")
  const blockSchema = recursiveSchema(app).add(blockProperties)

  if (mongooseClient.modelNames().includes(modelName))
    mongooseClient.deleteModel(modelName)
  return mongooseClient.model(modelName, blockSchema)
}
