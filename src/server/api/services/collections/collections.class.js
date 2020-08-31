import { v4 as uuid } from "uuid"
import { GeneralError } from "@feathersjs/errors"

import Recursive from "../abstract/recursive/recursive.class"
import CollectionCreateMixin from "./component/collection.create"
import CollectionPatchMixin from "./component/collection.patch"

export default class Collections extends CollectionPatchMixin(
  CollectionCreateMixin(Recursive)
) {
  async create(body, meta, id) {
    /**
     * @since - POST API CALL
     * @summary - Create Collection of Request
     */
    if (!meta.inner)
      throw new GeneralError(new Error("You can't directly create Collection"))
    return await super.create(body, meta)
  }

  async patch(id, body, meta) {
    meta.query = {}
    if (!id) id = body.id
    const unpatched = await this.getDoc(id)
    const blockService = this.app.service("block")
    const mainView = await blockService.getDoc(unpatched.main_view)

    // Make history Collection -> History Collection view
    meta.isHistory = true
    const history = unpatched.history
    unpatched.origin = unpatched.id

    const cid = uuid()
    unpatched.id = cid
    unpatched.alive = false
    super.create(unpatched, meta)
    mainView.collection_id = cid

    // await becaure at patchmain -set main view
    mainView.origin = mainView.id
    const vid = uuid()
    mainView.alive = false
    mainView.id = vid
    await blockService.create(mainView, meta)
    meta.isHistory = false

    // Update history
    body.history = history
    const updatedDoc = await this.patchMain(vid, body, unpatched, id, meta)

    // 6. Make Response
    return updatedDoc
  }

  async remove(id, meta) {
    /**
     * @since - DELETE REST API CALL
     * @summary - Remove Collection and Store in Page Trash Bin
     */
    if (!meta.inner)
      throw new GeneralError(new Error("You can't directly remove Collection"))
    return await super.remove(id, meta)
  }
}
