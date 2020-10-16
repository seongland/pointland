import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    images: { type: Array },
    pointclouds: { type: Array }
  },
  { _id: false }
)
