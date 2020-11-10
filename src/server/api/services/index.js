import consola from 'consola'
import logger, { getUserLogger } from '../inout/logger'
import addUserService from './users/users.service'
import addOrgService from './orgs/orgs.service'
import addFacilityService from './facilities/facilities.service'
import addProjectService from './projects/projects.service'

export default app => {
  addUserService(app)
  addFacilityService(app)
  addProjectService(app)
  addOrgService(app)
}

function feathersLogger(context) {
  if (!context.params.user) return context
  const info = JSON.stringify({
    url: context.path,
    method: context.method.toUpperCase(),
    body: context.data,
    query: context.params.query,
    mail: context.params.user.email,
    pid: process.pid
  })
  getUserLogger(context.params.user.email).info(info)
  logger.info(info)
}

function feathersErrorHandler(context) {
  if (!context.params.user) return context
  context.error.url = context.path
  context.error.method = context.method.toUpperCase()
  context.error.body = context.data
  context.error.query = context.params.query
  context.error.mail = context.params.user.email
  context.error.pid = process.pid
  delete context.error.context

  getUserLogger(context.params.user.email).error(context.error)
  logger.error(context.error)

  if (process.env.NODE_ENV !== 'production') consola.error(context.error)
}

export { feathersLogger, feathersErrorHandler }
