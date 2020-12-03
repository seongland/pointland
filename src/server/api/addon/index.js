import consola from 'consola'
import logger, { getUserLogger } from '../inout/logger'

function mixinErrHandler(err, req, res) {
  err.url = req.url
  err.body = req.body
  err.query = req.query
  err.mail = req.user.email
  res.json(err)
  consola.error(err)
  getUserLogger(req.user.email).error(err)
  logger.error(err)
}

function mixinLogger(req) {
  const info = JSON.stringify({
    url: req.url,
    body: req.body,
    query: req.query,
    mail: req.user.email
  })
  getUserLogger(req.user.email).info(info)
  logger.info(info)
}

function mixinWrapper(mixin) {
  return (req, res) => {
    mixinLogger(req)
    mixin(req, res).catch(err => mixinErrHandler(err, req, res))
  }
}

export { mixinLogger, mixinWrapper }
