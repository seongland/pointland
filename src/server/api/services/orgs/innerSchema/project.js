import mongoose from "mongoose"

export default new mongoose.Schema(
  {
    id: { type: String }
  },
  { _id: false }
)
