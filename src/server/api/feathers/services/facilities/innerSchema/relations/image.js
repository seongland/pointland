import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    round: { type: String },
    snap: { type: String },
    name: { type: String },
    direction: { type: String },
    coordinates: { type: Array }
  },
  { _id: false }
)
