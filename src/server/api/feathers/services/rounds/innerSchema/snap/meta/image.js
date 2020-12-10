import mongoose from 'mongoose'
import columnSchema from './column/'

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
        mainZone: columnSchema,
        lasList: columnSchema
      },
      required: true
    },
    filter: { type: String, required: true },
    prefix: { type: Object },
    direction: { type: Object },
    indexing: { type: String }
  },
  { _id: false }
)
