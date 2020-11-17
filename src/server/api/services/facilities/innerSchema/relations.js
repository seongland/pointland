import mongoose from 'mongoose'
import imageSchema from './relations/image'
import pcdSchema from './relations/pointcloud'

export default new mongoose.Schema(
  {
    images: { type: [imageSchema] },
    pointclouds: { type: [pcdSchema] },
    reported: { type: Boolean, default: false, index: true },
    located: { type: Boolean, default: false, index: true },
    proped: { type: Boolean, default: false, index: true },
    related: { type: Boolean, default: false, index: true },
    maker: { type: String, default: 'Stryx' }
  },
  { _id: false }
)
