import mongoose from 'mongoose'
import imgSchema from './snap/meta/image'
import pcdSchema from './snap/meta/pointcloud'
import formatSchema from './snap/format'

export default new mongoose.Schema(
  {
    name: { type: String, required: true },
    folder: { type: String, required: true },
    image: { type: { formats: [formatSchema], meta: imgSchema }, required: true },
    pointcloud: { type: { formats: [formatSchema], meta: pcdSchema }, required: true }
  },
  { _id: false }
)
