import mongoose from "mongoose"
export default new mongoose.Schema(
  {
    id: { type: String, default: undefined },
    role: { type: String, default: undefined },

    // Not yet
    allow_search_engine_indexing: { type: Boolean, default: undefined },
    allow_duplicate: { type: Boolean, default: undefined },
    block_pagtypee_width: { type: String, default: undefined }
  },
  { _id: false }
)
