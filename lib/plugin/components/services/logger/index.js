const LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
const nullLogger = require('./null-logger')(LEVELS)
const pino = require('pino')
const pinoPretty = require('pino-pretty')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
const { isPlainObject } = require('lodash')

class Logger {
  boot (options) {
    this.shouldLog = [...LEVELS, 'ON', '*'].includes(process.env.LOGGER)
    this.level = LEVELS.includes(process.env.LOGGER)
      ? process.env.LOGGER
      : (process.env.LOGGER === '*' ? 'trace' : 'info')
    this.loggerOutputFilePath = generateFilePath(process.env.LOGGER_OUTPUT_DIR_PATH)
    options.messages.info(this.loggerOutputFilePath ? `Output logs to ${this.loggerOutputFilePath}` : 'No output file')
    this.logger = this.createLogger()

    const createLogFn = level => { this[level] = msg => this.logger[level](msg) }
    LEVELS.forEach(createLogFn)

    this.info('Logger initialised')
  }

  child (arg) {
    const namespace = (typeof arg === 'string' ? arg : (isPlainObject(arg) ? arg.namespace : '')) || 'logger'
    const opts = { namespace }
    return this.logger.child(opts)
  }

  // addLogger (namespace = 'logger') {
  //   const fns = {}
  //   const createLogFn = level => { fns[level] = (...args) => this.logger[level](`[${namespace}] ${args.join(' ')}`) }
  //   LEVELS.forEach(createLogFn)
  //   return fns
  // }

  createLogger () {
    if (this.shouldLog) {
      // const opts = { level: this.level }
      // if (process.env.NODE_ENV === 'development') opts.transport = { target: 'pino-pretty' }
      // const stream = pino.destination(this.loggerOutputFilePath)
      // return pino(opts, stream)

      const streams = createMultistream(this.loggerOutputFilePath, this.level)
      const hooks = {
        logMethod (inputArgs, method, level) {
          const msg = inputArgs.join(' ')
          return method.apply(this, [msg])
        }
      }
      return pino({ level: this.level, hooks }, streams)

      // const transport = createTransport(this.loggerOutputFilePath, this.level)
      // const logger = pino(transport)
      // logger.level = this.level
      // return logger
    } else {
      return nullLogger
    }
  }

  isValidLevel (level) {
    return LEVELS.includes(level)
  }
}

function generateFilePath (dirpath) {
  if (!dirpath) return
  if (!fs.existsSync(dirpath)) return

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
  const streams = []
  if (filepath) streams.push({ stream: pino.destination(filepath), level })
  if (process.env.NODE_ENV === 'development' || !filepath) streams.push({ stream: pinoPretty() })
  return pino.multistream(streams)
}

module.exports = {
  schema: require('./schema.json'),
  serviceClass: Logger,
  bootBefore: ['tymly']
}
