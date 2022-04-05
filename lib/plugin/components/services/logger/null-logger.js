const LOG_LEVELS = require('./log-levels').reverse()
const logFn = level => (...args) => { console.log(`[${level}] ${args.join(' ')}`) }
const nullLogFn = () => () => { }

module.exports = options => {
  const { level: levelSpecified } = options

  const logger = {}

  const i = LOG_LEVELS.indexOf(levelSpecified)

  LOG_LEVELS.forEach((level, j) => {
    logger[level] = (i === -1 || i < j)
      ? nullLogFn(level)
      : logFn(level)
  })

  logger.child = () => logger

  return logger
}
