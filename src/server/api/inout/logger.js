import { transports, createLogger, format } from 'winston'
import 'winston-daily-rotate-file'

// Logger per User
const userLoggerCache = new Map()

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

export { getUserLogger }
export default logger
