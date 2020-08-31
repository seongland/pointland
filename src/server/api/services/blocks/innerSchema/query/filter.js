import mongoose from "mongoose"

export default new mongoose.Schema(
  {
    property: { type: String, default: undefined },
    value: { type: String, default: undefined },
    type: { type: String, default: undefined, required: true }
  },
  { _id: false }
)
