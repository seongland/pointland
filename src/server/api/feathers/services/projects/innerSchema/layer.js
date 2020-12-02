import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    recorded: { type: String },
    draft: { type: String },
    processed: { type: String },
    tiff: { type: String },
    mission: { type: String }
  },
  { _id: false }
)
