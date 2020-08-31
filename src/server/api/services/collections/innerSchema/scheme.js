import mongoose from "mongoose"
import optionsSchema from "./scheme/options"

export default new mongoose.Schema(
  {
    type: { type: String, default: undefined },
    options: { type: optionsSchema, default: undefined },
    template_pages: { type: [String], default: undefined }
  },
  { _id: false }
)
