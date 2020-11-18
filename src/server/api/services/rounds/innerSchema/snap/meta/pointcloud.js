import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    folder: { type: String, required: true },
    ext: { type: String, required: true },
    column: {
      type: {
        name: columnSchema
      },
      required: true
    }
  },
  { _id: false }
)
