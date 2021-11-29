/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('../lib')
const path = require('path')
const fs = require('fs')

function readLogFile (filepath) {
  const data = fs.readFileSync(filepath, 'utf8')
  return data
    .split('\n')
    .filter(line => line)
    .map(JSON.parse)
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
      expect(filepath).to.eql(undefined)
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
      expect(logs.length).to.eql(6)
      const levels = logs.map(l => l.level)
      expect(levels.includes(10)).to.eql(true) // trace
      expect(levels.includes(20)).to.eql(true) // debug
      expect(levels.includes(30)).to.eql(true) // info
      expect(levels.includes(40)).to.eql(true) // warn
      expect(levels.includes(50)).to.eql(true) // error
      expect(levels.includes(60)).to.eql(true) // fatal
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
      expect(logs.length).to.eql(4)
      const levels = logs.map(l => l.level)
      expect(levels.includes(10)).to.eql(false) // trace
      expect(levels.includes(20)).to.eql(false) // debug
      expect(levels.includes(30)).to.eql(true) // info
      expect(levels.includes(40)).to.eql(true) // warn
      expect(levels.includes(50)).to.eql(true) // error
      expect(levels.includes(60)).to.eql(true) // fatal
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
      const levels = logs.map(l => l.level)
      expect(levels.includes(10)).to.eql(false) // trace
      expect(levels.includes(20)).to.eql(false) // debug
      expect(levels.includes(30)).to.eql(false) // info
      expect(levels.includes(40)).to.eql(false) // warn
      expect(levels.includes(50)).to.eql(true) // error
      expect(levels.includes(60)).to.eql(true) // fatal
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
      expect(logs.length).to.eql(6)
      const levels = logs.map(l => l.level)
      expect(levels.includes(10)).to.eql(true) // trace
      expect(levels.includes(20)).to.eql(true) // debug
      expect(levels.includes(30)).to.eql(true) // info
      expect(levels.includes(40)).to.eql(true) // warn
      expect(levels.includes(50)).to.eql(true) // error
      expect(levels.includes(60)).to.eql(true) // fatal
    })

    it('clean up output file', () => {
      const filepath = bootedServices.logger.loggerOutputFilePath
      fs.unlinkSync(filepath)
    })

    it('shutdown Tymly', async () => {
      await bootedServices.tymly.shutdown()
    })
  })
})