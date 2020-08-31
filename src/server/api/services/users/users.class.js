import { v4 as uuid } from "uuid"
import HidraService from "../abstract/default/default.class"

export default class Users extends HidraService {
  async create(body, meta) {
    const blockService = this.app.service("block")
    const spaceViewId = uuid()
    const pageId = uuid()
    const uid = uuid()

    meta.inner = true
    blockService.create({ id: pageId }, meta)
    const spaceView = await blockService.create(
      { id: spaceViewId, content: [pageId] },
      meta
    )
    body.content = [spaceView.space_id]
    body.id = uid
    return super.create(body, meta)
  }
}
