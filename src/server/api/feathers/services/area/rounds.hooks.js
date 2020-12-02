import { hooks as authenticationHooks } from '@feathersjs/authentication'
import { feathersLogger } from '../../inout/logger'

const authenticate = authenticationHooks.authenticate

export default {
  before: {
    all: [authenticate('jwt'), feathersLogger],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
