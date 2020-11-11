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

    Type: { type: String },
    SubType: { type: mongoose.Mixed },
    NodeType: { type: String },
    LinkType: { type: String },
    RoadType: { type: String },

    User: { type: String },
    Unit: { type: String },
    Post: { type: Boolean },
    Value: { type: String },
    Length: { type: String },
    MaxSpeed: { type: String },
    StopLine: { type: String },
    RelatedSig: { type: String },
    Orientation: { type: String },
    Orientation: { type: String },

    NodeID: { type: String },
    LinkID: { type: String },
    L_LinkID: { type: String },
    R_LinkID: { type: String },
    FromNodeID: { type: String },
    ToNodeID: { type: String },
    ITSLinkID: { type: String },
    L_LaneChan: { type: String },
    R_LaneChan: { type: String },

    Ref_Line: { type: Number },

    // Meta
    comment: { type: String },
    layer: { type: String },
    version: { type: String, default: 'morai' }
  },
  { _id: false }
)
