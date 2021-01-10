import mongoose from 'mongoose'
import dotenv from 'dotenv'
import consola from 'consola'
import logger from './logger'

dotenv.config()

const connect = app => {
  mongoose
    .connect(process.env.DB_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => consola.success('DB Connected'))
    .catch(err => {
      consola.error(process.env.DB_URL)
      logger.error(err)
    })
  mongoose.connection.on('disconnected', connect)
  mongoose.Promise = global.Promise
  app.set('mongooseClient', mongoose)
}

export default connect
