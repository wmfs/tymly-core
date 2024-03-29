const LOG_LEVELS = require('./log-levels')
const nullLogger = require('./null-logger')
const pino = require('pino')
const pinoPretty = require('pino-pretty')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
const { isPlainObject } = require('lodash')

const findLevel = level => {
  if (level === 'ON') {
    return 'info'
  }

  if (level === '*') {
    return 'trace'
  }

  if (LOG_LEVELS.includes(level)) {
    return level
  }

  return null
}

class Logger {
  boot (options) {
    this.level = findLevel(process.env.LOGGER)
    this.shouldLog = this.level !== null

    options.messages.info(`Logger level set to: ${this.level}`)

    if (this.shouldLog) {
      this.loggerOutputFilePath = generateFilePath(process.env.LOGGER_OUTPUT_DIR_PATH)

      options.messages.info(this.loggerOutputFilePath ? `Output logs to ${this.loggerOutputFilePath}` : 'No output file')
    } else {
      options.messages.info('Using default logger')
    }

    this.logger = this.createLogger()

    const createLogFn = level => { this[level] = msg => this.logger[level](msg) }
    LOG_LEVELS.forEach(createLogFn)

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
  //   LOG_LEVELS.forEach(createLogFn)
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
      const formatters = {
        level (label, number) {
          return { level: number, levelLabel: label }
        }
      }
      return pino({ level: this.level, hooks, formatters }, streams)

      // const transport = createTransport(this.loggerOutputFilePath, this.level)
      // const logger = pino(transport)
      // logger.level = this.level
      // return logger
    } else {
      return nullLogger({ level: this.level })
    }
  }

  isValidLevel (level) {
    return LOG_LEVELS.includes(level)
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
