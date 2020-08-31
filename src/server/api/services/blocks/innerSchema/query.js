import mongoose from "mongoose"
import filterSchema from "./query/filter"
import sortSchema from "./query/sort"

export default new mongoose.Schema(
  {
    filters: { type: [filterSchema], default: undefined },
    filter_operator: { type: String, default: undefined },
    sorts: { type: [sortSchema], default: undefined }
  },
  { _id: false }
)
