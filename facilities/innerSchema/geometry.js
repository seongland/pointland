import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    type: { type: String },
    coordinates: { type: Array }
  },
  { _id: false }
)
