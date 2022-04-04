const logFn = level => (...args) => { console.log(`[${level}] ${args.join(' ')}`) }

module.exports = function (levels) {
  const logger = {}
  levels.forEach(level => { logger[level] = logFn(level) })
  logger.child = () => logger
  return logger
}
