import mongoose from 'mongoose'
import columnSchema from './column/'

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
