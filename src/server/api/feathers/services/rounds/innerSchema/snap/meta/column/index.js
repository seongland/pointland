import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }
  },
  { _id: false }
)
