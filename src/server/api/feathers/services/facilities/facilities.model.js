import defaultSchema from '../abstract/default/default.schema'
import relationsSchema from './innerSchema/relations'
import geometrySchema from './innerSchema/geometry'
import propertiesSchema from './innerSchema/properties'
const modelName = 'facilities'

export default app => {
  const mongooseClient = app.get('mongooseClient')
  const facilityProps = {
    type: { type: String, default: 'Feature' },
    relations: { type: relationsSchema, required: true },
    properties: { type: propertiesSchema, required: true },
    geometry: { type: geometrySchema, required: true }
  }
  const facilitySchema = defaultSchema(app).add(facilityProps)
  facilitySchema.index({ geometry: '2dsphere' })

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, facilitySchema)
}
