/**
 * @summary - default feathers class
 */
import { Service } from "feathers-mongoose"
import { v4 as uuid } from "uuid"

export default class HidraService extends Service {
  setup(app) {
    this.app = app
  }

  create(body, meta) {
    /**
     * @summary - All Document has uuid v4
     * @since - POST REST API CALL
     */
    let id
    if (!body.id) {
      id = uuid()
      body = { ...body, id }
    }
    const result = super.create(body, meta)
    return result
  }

  async find(meta) {
    /**
     * @summary - Remove _id
     */
    const response = await super.find(meta)
    for (const index in response) delete response[index]._id
    return response
  }

  patch(id, body, meta) {
    body.edited_by = meta.user.id
    body.edited_by_table = "user"
    return super.patch(id, body, meta)
  }
}
