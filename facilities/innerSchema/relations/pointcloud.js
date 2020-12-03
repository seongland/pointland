import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    round: { type: String },
    snap: { type: String },
    name: { type: String }
  },
  { _id: false }
)
