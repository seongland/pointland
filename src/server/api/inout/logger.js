import { transports, createLogger, format } from 'winston'
import 'winston-daily-rotate-file'
import consola from 'consola'

// Logger per User
const userLoggerCache = {}

function getUserLogger(email) {
  if (userLoggerCache[email]) return userLoggerCache[email]

  const newTransport = new transports.DailyRotateFile({
    filename: `log/${email}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '10m',
    maxFiles: '365d',
    auditFile: 'log/audit.json'
  })

  const newLogger = createLogger({
    level: 'debug',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.splat(),
      format.simple()
    ),
    transports: [newTransport]
  })
  userLoggerCache[email] = newLogger
  return newLogger
}

// All logger
const allTransport = new transports.DailyRotateFile({
  filename: 'log/All-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '10m',
  maxFiles: '365d',
  auditFile: 'log/audit.json'
})

const logger = createLogger({
  // debug or info
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.splat(),
    format.simple()
  ),
  transports: [allTransport]
})

export function feathersLogger(context) {
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

export function feathersErrorHandler(context) {
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

export { getUserLogger }
export default logger
