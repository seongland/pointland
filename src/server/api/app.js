import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
import feathers from '@feathersjs/feathers'

import compress from 'compression'
import cors from 'cors'

import authentication from './feathers/authentication'
import appHooks from './feathers/app.hooks'
import services from './services'
import meta from './addon/meta'
import image from './addon/image/'
import pointcloud from './addon/pointcloud/'
import facility from './addon/facility/'

import mongoose from './inout/mongoose'
import logger from './inout/logger'

const app = express(feathers())
  .use(express.json({ limit: '100mb' }))
  .configure(express.rest())
  .configure(configuration())
  .use(cors())
  .use(compress())
  .configure(mongoose)
  .configure(services)
  .configure(authentication)
  .configure(facility)
  .use('/image', image)
  .use('/pointcloud', pointcloud)
  .use(express.errorHandler({ logger }))
  .hooks(appHooks)

meta(app)
app.listen()
process.on('unhandledRejection', (reason, p) => logger.error('Unhandled Rejection at: Promise ', p, reason))

export default app
