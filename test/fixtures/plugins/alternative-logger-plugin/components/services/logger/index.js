const { isPlainObject } = require('lodash')
const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

class AlternativeLogger {
  boot () {
    this.shouldLog = true
    this.level = process.env.LOGGER

    this.logs = []

    const logFn = level => (...args) => {
      const message = args.join(' ')
      console.log(`[${level}] ${message}`)
      this.logs.push({ level, message })
    }

    const logger = {}
    levels.forEach(level => { logger[level] = logFn(level) })
    logger.child = () => logger
    this.logger = logger
  }

  child (arg) {
    const namespace = (typeof arg === 'string' ? arg : (isPlainObject(arg) ? arg.namespace : '')) || 'logger'
    const opts = { namespace }
    return this.logger.child(opts)
  }
}

module.exports = {
  serviceClass: AlternativeLogger,
  bootBefore: ['tymly']
}
