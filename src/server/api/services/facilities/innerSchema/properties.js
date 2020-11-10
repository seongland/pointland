import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    // Geometry
    x: { type: Number },
    y: { type: Number },
    z: { type: Number },
    xyzs: { type: [Array] },

    // Morai
    id: { type: String },
    ID: { type: String },
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
    FromNodeID: { type: String },
    ToNodeID: { type: String },
    RoadType: { type: String },
    LinkType: { type: String },
    RelatedSig: { type: String },
    MaxSpeed: { type: String },
    R_LinkID: { type: String },
    L_LinkID: { type: String },
    R_LaneChan: { type: String },
    L_LaneChan: { type: String },
    Length: { type: String },
    ITSLinkID: { type: String },
    LinkID: { type: String },
    NodeID: { type: String },

    // Meta
    comment: { type: String },
    layer: { type: String },
    version: { type: String, default: 'morai' }
  },
  { _id: false }
)
