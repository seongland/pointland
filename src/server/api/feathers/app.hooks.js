// Application hook that run for every service

import { traverse } from 'feathers-hooks-common'
import { feathersErrorHandler } from '../inout/logger'

const trimmer = function(node) {
  if (typeof node === 'string') {
    this.update(node.trim())
  }
}

const nuller = function(node) {
  if (node === 'null') {
    this.update(null)
  }
}

export default {
  before: {
    all: [],
    find: [traverse(nuller, context => context.params.query)],
    get: [],
    create: [traverse(trimmer)],
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
    all: [feathersErrorHandler],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
