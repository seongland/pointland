import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    comment: { type: String },
    x: { type: Number },
    y: { type: Number },
    z: { type: Number },
    version: { type: String, default: 'morai' }
  },
  { _id: false }
)
