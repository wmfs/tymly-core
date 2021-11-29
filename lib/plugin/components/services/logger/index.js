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

    // const createLogFn = level => { this[level] = msg => this.logger[level](msg) }
    // LEVELS.forEach(createLogFn)
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

      const { stream, filepath } = ensureFileStream(process.env.LOGGER_OUTPUT_DIR_PATH)
      this.loggerOutputFilePath = filepath

      return pino(opts, stream)
    } else {
      const logger = nullLogger
      logger.child = () => logger
      return logger
    }
  }

  // child (opts) {
  //   return this.logger.child(opts)
  // }
}

function ensureFileStream (dirpath) {
  if (!dirpath) return {}
  if (!fs.existsSync(dirpath)) return {}

  const now = moment()
  const filename = `${now.format('YYYYMMDD-HHmm')}.txt`
  const filepath = path.join(dirpath, filename)

  try {
    /*
    An ordinary Node.js stream can be passed as the destination (such as the result of `fs.createWriteStream`)
    but for peak log writing performance it is strongly recommended to use `pino.destination`
    */
    // const stream = fs.createWriteStream(filepath)
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
