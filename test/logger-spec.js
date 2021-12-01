/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('../lib')
const path = require('path')
const fs = require('fs')

const LEVEL_MAP = { fatal: 60, error: 50, warn: 40, info: 30, debug: 20, trace: 10 }

function readLogFile (filepath) {
  const data = fs.readFileSync(filepath, 'utf8')
  return data
    .split('\n')
    .filter(line => line)
    .map(JSON.parse)
}

function expectAllLevels (logs) {
  logs.shift()
  const levels = logs.map(l => l.level)

  const notLogged = Object.values(LEVEL_MAP).filter(l => !levels.includes(l))
  if (notLogged.length) console.log(`Did not log: ${notLogged.join(', ')}`)
  expect(notLogged.length).to.eql(0)

  expect(
    logs.find(l => l.level === 10).msg
  ).to.eql(
    'This is a trace message'
  )

  expect(
    logs.find(l => l.level === 20).msg
  ).to.eql(
    'This is a debug message'
  )

  expect(
    logs.find(l => l.level === 30).msg
  ).to.eql(
    'This is an info message'
  )

  expect(
    logs.find(l => l.level === 40).msg
  ).to.eql(
    'This is a warn message'
  )

  expect(
    logs.find(l => l.level === 50).msg
  ).to.eql(
    'This is an error message'
  )

  expect(
    logs.find(l => l.level === 60).msg
  ).to.eql(
    'This is a fatal message'
  )
}

function expectSomeLevels (logs, expectedLevels) {
  logs.shift()
  const levels = logs.map(l => l.level)

  for (const [key, value] of Object.keys(LEVEL_MAP)) {
    if (expectedLevels.includes(key)) {
      expect(levels.includes(value)).to.eql(true)
    } else {
      expect(levels.includes(value)).to.eql(false)
    }
  }
}

describe('Logger tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let bootedServices

  const pluginPaths = [
    path.resolve(__dirname, './fixtures/plugins/logger-plugin')
  ]

  process.env.LOGGER_OUTPUT_DIR_PATH = path.join(__dirname, 'logging-output')

  describe('no logger', () => {
    it('boot tymly', async () => {
      process.env.LOGGER = null
      bootedServices = await tymly.boot({ pluginPaths })
      expect(bootedServices.logger.shouldLog).to.eql(false)
    })

    it('output file should not exist as logger is turned off', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      // expect(filepath).to.eql(undefined)
      expect(fs.existsSync(filepath)).to.eql(false)
    })

    it('shutdown Tymly', async () => {
      await bootedServices.tymly.shutdown()
    })
  })

  describe('all levels', () => {
    it('boot tymly', async () => {
      process.env.LOGGER = '*'
      bootedServices = await tymly.boot({ pluginPaths })
      expect(bootedServices.logger.shouldLog).to.eql(true)
      expect(bootedServices.logger.level).to.eql('trace')
    })

    it('check output file exists', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      expect(filepath).to.not.eql(undefined)
      expect(fs.existsSync(filepath)).to.eql(true)
    })

    it('check output file contents', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      const logs = readLogFile(filepath)
      expect(logs.length).to.eql(7)
      expectAllLevels(logs)
    })

    it('clean up output file', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      fs.unlinkSync(filepath)
    })

    it('shutdown Tymly', async () => {
      await bootedServices.tymly.shutdown()
    })
  })

  describe('default level', () => {
    it('boot tymly', async () => {
      process.env.LOGGER = 'ON'
      bootedServices = await tymly.boot({ pluginPaths })
      expect(bootedServices.logger.shouldLog).to.eql(true)
      expect(bootedServices.logger.level).to.eql('info')
    })

    it('check output file exists', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      expect(filepath).to.not.eql(undefined)
      expect(fs.existsSync(filepath)).to.eql(true)
    })

    it('check output file contents', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      const logs = readLogFile(filepath)
      expect(logs.length).to.eql(5)
      expectSomeLevels(logs, ['info', 'warn', 'error', 'fatal'])
    })

    it('clean up output file', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      fs.unlinkSync(filepath)
    })

    it('shutdown Tymly', async () => {
      await bootedServices.tymly.shutdown()
    })
  })

  describe('error level', () => {
    it('boot tymly', async () => {
      process.env.LOGGER = 'error'
      bootedServices = await tymly.boot({ pluginPaths })
      expect(bootedServices.logger.shouldLog).to.eql(true)
      expect(bootedServices.logger.level).to.eql('error')
    })

    it('check output file exists', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      expect(filepath).to.not.eql(undefined)
      expect(fs.existsSync(filepath)).to.eql(true)
    })

    it('check output file contents', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      const logs = readLogFile(filepath)
      expect(logs.length).to.eql(2)
      expectSomeLevels(logs, ['error', 'fatal'])
    })

    it('clean up output file', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      fs.unlinkSync(filepath)
    })

    it('shutdown Tymly', async () => {
      await bootedServices.tymly.shutdown()
    })
  })

  describe('trace level', () => {
    it('boot tymly', async () => {
      process.env.LOGGER = 'trace'
      bootedServices = await tymly.boot({ pluginPaths })
      expect(bootedServices.logger.shouldLog).to.eql(true)
      expect(bootedServices.logger.level).to.eql('trace')
    })

    it('check output file exists', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      expect(filepath).to.not.eql(undefined)
      expect(fs.existsSync(filepath)).to.eql(true)
    })

    it('check output file contents', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      const logs = readLogFile(filepath)
      expect(logs.length).to.eql(7)
      expectAllLevels(logs)
    })

    it('clean up output file', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      fs.unlinkSync(filepath)
    })

    it('shutdown Tymly', async () => {
      await bootedServices.tymly.shutdown()
    })
  })

  after('reset logging environment variables', () => {
    process.env.LOGGER = null
    process.env.LOGGER_OUTPUT_DIR_PATH = null
  })
})
