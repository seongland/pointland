import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
import feathers from '@feathersjs/feathers'

import compress from 'compression'
import cors from 'cors'

import authentication from './feathers/authentication'
import appHooks from './feathers/app.hooks'
import services from './services'
import image from './addon/image'
import meta from './addon/meta'
import pointcloud from './addon/pointcloud'

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
  .use('/image', image)
  .use('/pointcloud', pointcloud)
  .use('/meta', meta)
  .use(express.errorHandler({ logger }))
  .hooks(appHooks)

app.listen()
process.on('unhandledRejection', (reason, p) => logger.error('Unhandled Rejection at: Promise ', p, reason))

export default app
