import mongoose from 'mongoose'
import imageSchema from './relations/image'
import pcdSchema from './relations/pointcloud'

export default new mongoose.Schema(
  {
    images: { type: [imageSchema] },
    pointclouds: { type: [pcdSchema] },
    reported: { type: Boolean, default: false },
    located: { type: Boolean, default: false },
    proped: { type: Boolean, default: false },
    related: { type: Boolean, default: false },
    maker: { type: String, default: 'Stryx' }
  },
  { _id: false }
)
