import mongoose from 'mongoose'
import imgSchema from './snap/meta/image'
import pcdSchema from './snap/meta/pointcloud'
import formatSchema from './snap/format'

export default new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: { formats: [formatSchema], meta: imgSchema, parent: String }, required: true },
    pointcloud: { type: { formats: [formatSchema], meta: pcdSchema, parent: String }, required: true }
  },
  { _id: false }
)
