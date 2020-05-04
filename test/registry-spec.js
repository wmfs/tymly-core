/* eslint-env mocha */

const path = require('path')
const expect = require('chai').expect

describe('Registry tests', function () {
  const tymly = require('./../lib')

  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let registryService

  describe('startup', () => {
    it('load the cat blueprint, which has some registry keys', async () => {
      const tymlyServices = await tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/cats-blueprint')
          ],

          pluginPaths: [
            path.resolve(__dirname, './fixtures/plugins/cats-plugin')
          ]
        }
      )

      tymlyService = tymlyServices.tymly
      registryService = tymlyServices.registry
    })

    const key = 'tymlyTest_mealThreshold'

    it('verify key exists', () => {
      expect(registryService.has(key)).to.eql(true)
    })

    it('registry value is correct, direct access', () => {
      expect(registryService.registry.tymlyTest_mealThreshold.value).to.eql(3)
    })

    it('registry value is correct, using key', () => {
      const value = registryService.get(key)
      expect(value).to.eql(3)
    })

    it('change registry value, using key', async () => {
      await registryService.set(key, 2)
      expect(registryService.get(key)).to.eql(2)
    })
  })

  describe('reboot', () => {
    it('reboot tymly, set a registry key value by binding to environment variable)', async () => {
      process.env.MEAL_THRESHOLD = 5
      const tymlyServices = await tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/cats-blueprint')
          ],

          pluginPaths: [
            path.resolve(__dirname, './fixtures/plugins/cats-plugin')
          ]
        }
      )

      registryService = tymlyServices.registry
    })

    it('the environment variable is correctly set in the registry by env vars', () => {
      expect(registryService.registry.tymlyTest_mealThreshold.meta.schema.properties.environmentVariableName).to.eql('MEAL_THRESHOLD')
    })

    it('registry value is correct, direct access', () => {
      expect(registryService.registry.tymlyTest_mealThreshold.value).to.eql('5')
    })

    const key = 'tymlyTest_mealThreshold'
    it('change registry value, using key', async () => {
      await registryService.set(key, 2)
      expect(registryService.get(key)).to.eql(2)
    })

    it('reset registry value, using key', async () => {
      await registryService.clear(key)
      expect(registryService.has(key)).to.eql(false)
    })
  })

  describe('free form reg key', () => {
    const key = 'test_key'

    it('value doesn\'t exist', () => {
      expect(registryService.has(key)).to.eql(false)
    })

    it('set value by key', async () => {
      await registryService.set(key, 'trousers')
    })

    it('verify value', () => {
      expect(registryService.has(key)).to.eql(true)
      expect(registryService.get(key)).to.eql('trousers')
      expect(registryService.registry[key].value).to.eql('trousers')
    })

    it('reset value by key', async () => {
      await registryService.clear(key)
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
