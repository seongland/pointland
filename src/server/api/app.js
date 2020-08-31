import configuration from "@feathersjs/configuration"
import express from "@feathersjs/express"
import feathers from "@feathersjs/feathers"

import compress from "compression"
import cors from "cors"

import authentication from "./feathers/authentication"
import appHooks from "./feathers/app.hooks"
import services from "./services"
import mongoose from "./mongoose"
import logger from "./logger"
import upload from './upload'

const app = express(feathers())
  .use(express.json({ limit: "100mb" }))
  .configure(express.rest())
  .configure(configuration())
  .use(cors())
  .use(compress())
  .configure(mongoose)
  .configure(services)
  .configure(authentication)
  .use('/upload', upload)
  .use(express.errorHandler({ logger }))
  .hooks(appHooks)

app.listen()

export default app
