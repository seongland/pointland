const defaultProperties = {
  // Main Data
  id: { type: String, required: true, unique: true },

  // Revision Data
  created_by: { type: String, default: undefined },
  edited_by: { type: String, default: undefined }
}

export const defaultOptions = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'edited_at'
  },
  versionKey: false,
  strict: true
}

export default app => {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const defaultSchema = new Schema(defaultProperties, defaultOptions)
  defaultSchema.options.toJSON = {
    transform: (doc, json) => {
      delete doc._id
      delete json._id
    }
  }
  defaultSchema.set('toObject', { flattenMaps: true })
  return defaultSchema
}
