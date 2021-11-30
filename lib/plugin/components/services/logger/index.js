const LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
const nullLogger = require('abstract-logging')
const pino = require('pino')
const moment = require('moment')
const path = require('path')
const fs = require('fs')

class Logger {
  boot (options) {
    this.shouldLog = [...LEVELS, 'ON', '*'].includes(process.env.LOGGER)

    this.level = LEVELS.includes(process.env.LOGGER)
      ? process.env.LOGGER
      : (process.env.LOGGER === '*' ? 'trace' : 'info')

    this.logger = this.createLogger()
  }

  addLogger (namespace = 'logger') {
    const fns = {}
    const createLogFn = level => { fns[level] = (...args) => this.logger[level](`[${namespace}] ${args.join(' ')}`) }
    LEVELS.forEach(createLogFn)
    return fns
  }

  createLogger () {
    if (this.shouldLog) {
      const opts = {
        level: this.level
      }

      const { stream, filepath } = createFileStream(process.env.LOGGER_OUTPUT_DIR_PATH)
      this.loggerOutputFilePath = filepath

      return pino(opts, stream)
    } else {
      const logger = nullLogger
      logger.child = () => logger
      return logger
    }
  }
}

function generateFilePath (dirpath) {
  if (!dirpath) return {}
  if (!fs.existsSync(dirpath)) return {}

  const now = moment()
  const filename = `${now.format('YYYYMMDD-HHmm')}.txt`
  return path.join(dirpath, filename)
}

function createFileStream (dirpath) {
  const filepath = generateFilePath(dirpath)

  try {
    const stream = pino.destination(filepath)
    return { stream, filepath }
  } catch (err) {
    console.log(`Failed to create logger write stream at ${filepath}`)
    return {}
  }
}

module.exports = {
  schema: require('./schema.json'),
  serviceClass: Logger,
  bootBefore: ['tymly']
}
