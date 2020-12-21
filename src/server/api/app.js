import express from '@feathersjs/express'
import feathers from '@feathersjs/feathers'

import cors from 'cors'

import appHooks from './feathers/app.hooks'
import services from './feathers/services'

import mongoose from './inout/mongoose'
import logger from './inout/logger'

export const ref = {}

const app = express(feathers())
  .use(express.json({ limit: '100mb' }))
  .configure(express.rest())
  .use(cors())
  .configure(mongoose)
  .configure(services)
  .use(express.errorHandler({ logger }))
  .hooks(appHooks)

ref.app = app
app.listen()

export default app
