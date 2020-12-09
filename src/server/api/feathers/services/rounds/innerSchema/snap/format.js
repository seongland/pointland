import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    type: { type: String, required: true },
    folder: { type: String, required: true },
    ext: { type: String, required: true },
    version: { type: String }
  },
  { _id: false }
)
