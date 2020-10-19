import mongoose from 'mongoose'
import imageSchema from './relations/image'
import pcdSchema from './relations/pointcloud'

export default new mongoose.Schema(
  {
    images: { type: [imageSchema] },
    pointclouds: { type: [pcdSchema] },
    maker: { type: String }
  },
  { _id: false }
)
