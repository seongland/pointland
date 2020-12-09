import addUserService from './services/users/users.service'
import addOrgService from './services/orgs/orgs.service'
import addFacilityService from './services/facilities/facilities.service'
import addProjectService from './services/projects/projects.service'
import addRoundService from './services/rounds/rounds.service'

export default app => {
  addUserService(app)
  addFacilityService(app)
  addProjectService(app)
  addOrgService(app)
  addRoundService(app)
}
