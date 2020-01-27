/* eslint-env mocha */

const path = require('path')
const expect = require('chai').expect

describe('Registry tests', function () {
  const tymly = require('./../lib')

  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let registryService

  describe('startup', () => {
    it('load the cat blueprint, which has some registry keys', function (done) {
      tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/cats-blueprint')
          ],

          pluginPaths: [
            path.resolve(__dirname, './fixtures/plugins/cats-plugin')
          ]
        },
        function (err, tymlyServices) {
          expect(err).to.eql(null)
          tymlyService = tymlyServices.tymly
          registryService = tymlyServices.registry
          done()
        }
      )
    })

    it('verify key exists', () => {
      expect(registryService.has('tymlyTest_mealThreshold')).to.eql(true)
    })

    it('registry value is correct, direct access', function () {
      expect(registryService.registry.tymlyTest_mealThreshold.value).to.eql(3)
    })

    it('registry value is correct, using key', function (done) {
      const key = 'tymlyTest_mealThreshold'
      const value = registryService.get(key)
      expect(value).to.eql(3)
      done()
    })

    it('change registry value, using key', function (done) {
      const key = 'tymlyTest_mealThreshold'
      registryService.set(key, 2, function (err) {
        expect(err).to.eql(null)
        expect(registryService.get(key)).to.eql(2)
        done()
      })
    })
  })

  describe('reboot', () => {
    it('reboot tymly, set a registry key value by binding to environment variable)', function (done) {
      process.env.MEAL_THRESHOLD = 5
      tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/cats-blueprint')
          ],

          pluginPaths: [
            path.resolve(__dirname, './fixtures/plugins/cats-plugin')
          ]
        },
        function (err, tymlyServices) {
          expect(err).to.eql(null)
          registryService = tymlyServices.registry
          done()
        }
      )
    })

    it('the environment variable is correctly set in the registry by env vars', function () {
      expect(registryService.registry.tymlyTest_mealThreshold.meta.schema.properties.environmentVariableName).to.eql('MEAL_THRESHOLD')
    })

    it('registry value is correct, direct access', function () {
      expect(registryService.registry.tymlyTest_mealThreshold.value).to.eql('5')
    })

    const key = 'tymlyTest_mealThreshold'
    it('change registry value, using key', function (done) {
      registryService.set(key, 2, function (err) {
        expect(err).to.eql(null)
        expect(registryService.get(key)).to.eql(2)
        done()
      })
    })

    it('reset registry value, using key', function (done) {
      registryService.clear(key, (err) => {
        expect(err).to.eql(null)
        expect(registryService.has(key)).to.eql(false)
        done()
      })
    })
  })

  describe('free form reg key', () => {
    const key = 'test_key'

    it('value doesn\'t exist', () => {
      expect(registryService.has(key)).to.eql(false)
    })

    it('set value by key', (done) => {
      registryService.set(key, 'trousers', done)
    })

    it('verify value', () => {
      expect(registryService.has(key)).to.eql(true)
      expect(registryService.get(key)).to.eql('trousers')
      expect(registryService.registry[key].value).to.eql('trousers')
    })

    it('reset value by key', (done) => {
      registryService.clear(key, done)
    })

    it('value is gone', () => {
      expect(registryService.has(key)).to.eql(false)
    })
  })

  describe('shutdown', () => {
    it('should shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })
})
