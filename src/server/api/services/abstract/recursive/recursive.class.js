/**
 * @check - Change meta query before recall
 * @see - We do not return Dead document
 * @see - You can't change Dead Document
 */

import { v4 as uuid } from "uuid"
import { BadRequest, GeneralError } from "@feathersjs/errors"
import Table from "../default/default.class"
import RecursiveCreateMixin from "./component/recursive.create"
import RecursiveDeleteMixin from "./component/recursive.remove"
import RecursiveAPIMixin from "./component/recursive.api"
import RecursivePatchMixin from "./component/recursive.patch"

export default class Recursive extends RecursiveCreateMixin(
  RecursiveDeleteMixin(RecursiveAPIMixin(RecursivePatchMixin(Table)))
) {
  async find(meta) {
    /**
     * @summary - Remove _id
     */
    if (!meta.query.id) throw new GeneralError(new Error("Give ID!"))
    return await super.find(meta)
  }

  async create(body, meta) {
    /**
     * @since - POST REST API CALL
     * @summary - Create Recursive of Request
     */

    // 0. Init Create
    if (!meta.isHistory) this.createFilter(body)
    else this.historyFilter(body)

    const validateMsg = await this.validateCreate(body, meta)
    if (validateMsg) throw new BadRequest(validateMsg)

    // 2. Create Main
    const newDoc = await this.createMain(body, meta)

    // 3. Make Response
    return newDoc
  }

  async patch(id, body, meta) {
    /**
     * @since - UPDATE REST API CALL
     * @summary - Make History, Update Origin
     */

    // 0. Set Target
    if (!id) id = body.id
    if (!id) return new BadRequest("Plase set Target")
    const unpatched = await this.getRecordValue({ id })

    // 1. Validate Data & Make
    const validateMsg = await this.validatePatch(unpatched, body)
    if (validateMsg) throw new BadRequest(validateMsg)

    // 2. Filter Data
    this.patchFilter(body)
    if (!meta.inner) this.innerFilter(body)
    body.history = unpatched.history
    this.deadFilter(unpatched, id)

    // 3. Make History Document
    const hid = uuid()
    unpatched.id = hid
    super.create(unpatched, meta)
    const updatedDoc = await this.patchMain(hid, body, unpatched, id, meta)

    // 6. Make Response
    return updatedDoc
  }

  async remove(id, meta) {
    /**
     * @since - DELETE REST API CALL
     * @summary - Remove Block and Store in Page Trash Bin
     */
    // 0. Set Target
    if (!id) id = meta.query.id
    if (meta.permanent) return super.remove(id, meta)

    // 1. Catch Error - ※ findOne for save without history
    if (!id) return new BadRequest("Plase set Target")

    const unpatched = await this.Model.findOne({ id })
    if (!unpatched) return new BadRequest(`${id} not find`)
    if (!unpatched.alive) return new BadRequest("Already Dead")

    if (unpatched.parent_table === "space")
      return new BadRequest("Can't Remove Root Page")

    const deletedData = await this.removeMain(unpatched, id, meta)
    return deletedData
  }
}
