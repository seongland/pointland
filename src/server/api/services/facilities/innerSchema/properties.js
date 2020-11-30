import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    // Geometry
    x: { type: Number },
    y: { type: Number },
    z: { type: Number },
    xyzs: { type: [Array] },

    // Morai
    Type: { type: String },
    Kind: { type: String },
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
    PedstrianS: { type: String },
    Orientation: { type: String },

    NodeID: { type: String },
    LinkID: { type: String },
    LinkIDs: { type: [String], default: undefined },
    L_LinkID: { type: String },
    R_LinkID: { type: String },
    FromNodeID: { type: String },
    ToNodeID: { type: String },
    ITSNodeID: { type: String },
    ITSLinkID: { type: String },
    L_LaneChan: { type: String },
    R_LaneChan: { type: String },
    IntersectionControllerID: { type: String },

    Ref_Line: { type: Number },

    // Stryx
    comment: { type: String },

    // Meta
    layer: { type: String, index: true },
    version: { type: String, default: 'morai', index: true }
  },
  { _id: false }
)
