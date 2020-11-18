import mongoose from 'mongoose'
import columnSchema from 'column/'

export default new mongoose.Schema(
  {
    folder: { type: String, required: true },
    ext: { type: String, required: true },
    column: {
      type: {
        name: columnSchema,
        seq: columnSchema,
        lat: columnSchema,
        lon: columnSchema,
        alt: columnSchema,
        heading: columnSchema,
        x: columnSchema,
        y: columnSchema,
        roll: columnSchema,
        pitch: columnSchema,
        mainArea: columnSchema,
        lasList: columnSchema
      },
      required: true
    },
    filter: { type: String, required: true },
    directions: { type: [{ prefix: String, name: String }], default: [], required: true }
  },
  { _id: false }
)
