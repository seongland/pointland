import mongoose from "mongoose"

export default new mongoose.Schema(
  {
    property: { type: String, default: undefined },
    direction: { type: String, default: undefined }
  },
  { _id: false }
)
