import Service from '../abstract/default/default.class'

export default class Users extends Service {
  async create(body, meta) {
    /**
     * @summary - All Document has uuid v4
     * @since - POST REST API CALL
     */
    const app = this.app
    const newbie = await super.create(body, meta)
    console.log(newbie)

    // patch
    const user = { id: newbie.id, role: 'user' }
    let project
    for (const prj of newbie.projects)
      project = await app.service('project').Model.updateOne({ id: prj.id }, { $push: { users: user } })
    const organization = await app.service('org').Model.updateOne({ id: newbie.org.id }, { $push: { users: user } })
    console.log(project, organization)
    return newbie
  }
}
