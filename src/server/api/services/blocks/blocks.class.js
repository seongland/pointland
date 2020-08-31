/**
 * @check - Change meta query before recall
 */
import { GeneralError } from "@feathersjs/errors"

import Recursive from "../abstract/recursive/recursive.class"
import BlockAPIMixin from "./component/blocks.api"
import BlockCreateMixin from "./component/blocks.create"
import BlockPatchMixin from "./component/blocks.patch"

export default class Blocks extends BlockCreateMixin(
  BlockPatchMixin(BlockAPIMixin(Recursive))
) {
  async create(body, meta) {
    /**
     * @since - POST API CALL
     * @summary - Create Block of Request
     */

    if (!meta.inner) {
      const role = await this.roleCheck(
        body.parent_id,
        body.parent_table,
        meta.user.id
      )
      if (role !== "editor")
        throw new GeneralError(new Error("You don't have Create role"))
    }
    const request = body
    const type = request.type
    delete request.type
    const isCol = this.isCol(type)
    const isSpace = body.type === "space_view"

    // If Collection view -> create collection
    let collection, space
    if (isCol) collection = await this.setCollectionId(request, meta, body)
    else if (isSpace) space = await this.setSpaceId(request, meta, body)

    // Normal make
    request.type = type
    const newBlock = await super.create(body, meta)

    // Set view
    if (isCol) this.setCollectionView(newBlock.id, body, request, collection)
    else if (isSpace) this.setSpaceView(newBlock.id, body, request, space)
    return newBlock
  }

  async patch(id, body, meta) {
    /**
     * @since - UPDATE REST API CALL
     * @summary - Make History, Update Origin
     */

    if (!meta.inner) {
      const role = await this.roleCheck(body.id, "block", meta.user.id)
      if (role !== "editor")
        throw new GeneralError(new Error("You don't have Edit role"))
    }

    // To node case
    if (body.parent_table && this.isNodeOf(body.parent_table))
      body.type = "page"
    meta.inner = true

    const updatedBlock = await super.patch(id, body, meta)
    return updatedBlock
  }

  async remove(id, meta) {
    /**
     * @since - DELETE REST API CALL
     * @summary - Remove Block and Store in Page Trash Bin
     */

    if (!meta.inner) {
      const role = await this.roleCheck(id, "table", meta.user.id)
      if (role !== "editor")
        throw new GeneralError(new Error("You don't have delete role"))
    }

    const deletedBlock = await super.remove(id, meta)
    // If main view deleted -> delete nodes
    let collection
    if (this.isCol(deletedBlock.type)) {
      collection = await this.getRecordValue(
        { id: deletedBlock.collection_id },
        "collection"
      )
      if (collection.main_view === deletedBlock.id) {
        meta.query = {}
        meta.inner = true
        this.app.service("collection").remove(deletedBlock.collection_id, meta)
      }
    }
    return deletedBlock
  }
}
