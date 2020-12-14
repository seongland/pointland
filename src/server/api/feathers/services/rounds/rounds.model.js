import defaultSchema from '../abstract/default/default.schema'
import snapSchema from './innerSchema/snap'

const modelName = 'rounds'

export default app => {
  const mongooseClient = app.get('mongooseClient')

  const roundProperties = {
    name: { type: String, required: true, unique: true },
    nas: { type: { ip: String }, required: true },
    root: { type: String, required: true },
    snaps: { type: [snapSchema], required: true, default: [] }
  }
  const roundSchema = defaultSchema(app).add(roundProperties)
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, roundSchema)
}
