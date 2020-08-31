import { v4 as uuid } from "uuid"
import { GeneralError } from "@feathersjs/errors"

import Recursive from "../abstract/recursive/recursive.class"
import SpaceCreateMixin from "./component/spaces.create"
import SpacePatchMixin from "./component/spaces.patch"

export default class Spaces extends SpaceCreateMixin(
  SpacePatchMixin(Recursive)
) {
  async create(body, meta, id) {
    /**
     * @since - POST API CALL
     * @summary - Create space of Request
     */
    if (!meta.inner)
      throw new GeneralError(new Error("You can't directly create Space"))
    return await super.create(body, meta)
  }

  async patch(id, body, meta) {
    meta.query = {}
    if (!id) id = body.id
    const unpatched = await this.getDoc(id)
    const blockService = this.app.service("block")
    const mainView = await blockService.getDoc(unpatched.main_view)

    // Make history space -> History space view
    meta.isHistory = true
    const history = unpatched.history
    unpatched.origin = unpatched.id

    const sid = uuid()
    unpatched.id = sid
    await super.create(unpatched, meta)
    mainView.space_id = sid
    mainView.origin = mainView.id

    const vid = uuid()
    mainView.id = vid
    blockService.create(mainView, meta)
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
     * @summary - Remove space and Store in Page Trash Bin
     */
    if (!meta.inner)
      throw new GeneralError(new Error("You can't directly remove Space"))
    return await super.remove(id, meta)
  }
}
