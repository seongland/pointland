import mongoose from "mongoose"
import filterSchema from "./query/filter"
import sortSchema from "./query/sort"

export default new mongoose.Schema(
  {
    name: { type: String },
    role: { type: String, required }
  },
  { _id: false }
)
