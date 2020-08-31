import { hooks as authenticationHooks } from "@feathersjs/authentication"
import { feathersLogger } from "../"

const authenticate = authenticationHooks.authenticate

export default {
  before: {
    all: [hidraAuth, feathersLogger],
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

async function hidraAuth(context) {
  const authFunction = authenticate("jwt")
  const auth = await authFunction(context)
  return auth
}
