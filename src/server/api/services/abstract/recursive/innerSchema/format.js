import mongoose from "mongoose"

export default new mongoose.Schema(
  {
    block_width: { type: Number, default: undefined },
    block_full_width: { type: Boolean, default: undefined },
    block_page_width: { type: Boolean, default: undefined },
    block_aspect_ratio: { type: Number, default: undefined },
    block_preserve_scale: { type: Boolean, default: undefined },
    page_icon: { type: String, default: undefined },
    page_cover: { type: String, default: undefined },
    page_full_width: { type: Boolean, default: undefined },
    page_cover_position: { type: Number, default: undefined },
    collection_page_properties: { type: [Number], default: undefined }
  },
  { _id: false }
)
