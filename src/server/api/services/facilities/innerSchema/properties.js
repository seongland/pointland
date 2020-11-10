import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    comment: { type: String },
    x: { type: Number },
    y: { type: Number },
    z: { type: Number },

    Orientation: { type: String },
    Type: { type: String },
    SubType: { type: mongoose.Mixed },
    Value: { type: String },
    User: { type: String },
    Unit: { type: String },
    Post: { type: Boolean },
    Orientation: { type: String },
    NodeType: { type: String },
    StopLine: { type: String },
    ID: { type: String },

    LinkID: { type: String },
    NodeID: { type: String },

    layer: { type: String },
    version: { type: String, default: 'morai' }
  },
  { _id: false }
)
