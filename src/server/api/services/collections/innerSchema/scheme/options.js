import mongoose from "mongoose"

export default new mongoose.Schema(
  {
    id: { type: String, default: undefined, required: true },
    color: { type: String, default: undefined },
    value: { type: String, default: undefined }
  },
  { _id: false }
)
