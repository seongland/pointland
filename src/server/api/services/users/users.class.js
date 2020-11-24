import Service from '../abstract/default/default.class'
import consola from 'consola'

export default class Users extends Service {
  async create(body, meta) {
    /**
     * @summary - All Document has uuid v4
     * @since - POST REST API CALL
     */
    const app = this.app
    const newbie = await super.create(body, meta)
    consola.success('Newbie', newbie)

    // patch
    const user = { id: newbie.id, role: 'user' }
    for (const prj of newbie.projects)
      await app.service('project').Model.updateOne({ id: prj.id }, { $push: { users: user } })
    await app.service('org').Model.updateOne({ id: newbie.org.id }, { $push: { users: user } })
    return newbie
  }
}
