import mongoose from 'mongoose'
import imageSchema from './relations/image'
import pcdSchema from './relations/pointcloud'

export default new mongoose.Schema(
  {
    images: { type: [imageSchema] },
    pointclouds: { type: [pcdSchema] },
    located: { type: Boolean },
    proped: { type: Boolean },
    maker: { type: String, default: 'Stryx' }
  },
  { _id: false }
)
