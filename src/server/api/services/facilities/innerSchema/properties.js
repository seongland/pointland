import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    comment: { type: String },
    x: { type: Number },
    y: { type: Number },
    z: { type: Number },

    Orientation: { type: String },
    Type: { type: String },
    SubType: { type: String },
    Value: { type: String },
    Unit: { type: String },
    Post: { type: Boolean },

    layer: { type: String },
    version: { type: String, default: 'morai' }
  },
  { _id: false }
)
