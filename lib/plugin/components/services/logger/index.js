const LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
const nullLogger = require('abstract-logging')
const pino = require('pino')
const pinoPretty = require('pino-pretty')
const moment = require('moment')
const path = require('path')
const fs = require('fs')

class Logger {
  boot (options) {
    this.shouldLog = [...LEVELS, 'ON', '*'].includes(process.env.LOGGER)
    this.level = LEVELS.includes(process.env.LOGGER)
      ? process.env.LOGGER
      : (process.env.LOGGER === '*' ? 'trace' : 'info')
    this.loggerOutputFilePath = generateFilePath(process.env.LOGGER_OUTPUT_DIR_PATH)
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
      // const opts = { level: this.level }
      // if (process.env.NODE_ENV === 'development') opts.transport = { target: 'pino-pretty' }
      // const stream = pino.destination(this.loggerOutputFilePath)
      // return pino(opts, stream)

      const streams = createMultistream(this.loggerOutputFilePath, this.level)
      return pino({ level: this.level }, streams)

      // const transport = createTransport(this.loggerOutputFilePath, this.level)
      // const logger = pino(transport)
      // logger.level = this.level
      // return logger
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
  const filename = `${now.format('YYYYMMDD-HHmm')}.log`
  return path.join(dirpath, filename)
}

// function createTransport (filepath, level) {
//   try {
//     const opts = {
//       targets: [
//         {
//           level,
//           target: 'pino/file',
//           options: {
//             destination: filepath
//           }
//         }
//       ]
//     }
//     if (process.env.NODE_ENV === 'development') {
//       opts.targets.push({
//         level,
//         target: 'pino-pretty'
//       })
//     }
//     return pino.transport(opts)
//   } catch (err) {
//     console.log(`Failed to create logger transport at ${filepath}`)
//   }
// }

function createMultistream (filepath, level) {
  const streams = [
    { stream: pino.destination(filepath), level }
  ]
  if (process.env.NODE_ENV === 'development') {
    streams.push({ stream: pinoPretty() })
  }
  return pino.multistream(streams)
}

module.exports = {
  schema: require('./schema.json'),
  serviceClass: Logger,
  bootBefore: ['tymly']
}
