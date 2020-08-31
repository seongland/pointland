import logger from "./logger"
import app from "./app"

process.on("unhandledRejection", (reason, p) =>
  logger.error("Unhandled Rejection at: Promise ", p, reason)
)

export default app
