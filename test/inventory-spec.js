/* eslint-env mocha */

const path = require('path')
const expect = require('chai').expect
const startupMessages = require('../lib/startup-messages')

describe('Inventory tests', function () {
  const tymly = require('../lib')
  let tymlyService
  let inventoryService
  const blueprintPaths = [path.resolve(__dirname, './fixtures/blueprints/cats-blueprint')]
  const pluginPaths = [
    path.resolve(__dirname, './fixtures/plugins/cats-plugin')
  ]
  this.timeout(process.env.TIMEOUT || 5000)

  before('boot with an inventory service', async () => {
    const tymlyServices = await tymly.boot({
      blueprintPaths: blueprintPaths,
      pluginPaths: pluginPaths
    })

    tymlyService = tymlyServices.tymly
    inventoryService = tymlyServices.inventory
  })

  it('return inventory contents', function (done) {
    inventoryService.collateEverything(
      {
        blueprintPaths: blueprintPaths,
        pluginPaths: pluginPaths,
        messages: startupMessages()
      },
      function (err, inventory) {
        expect(err).to.eql(null)
        expect(inventory).to.be.an('object')
        expect(inventory.states.purring).to.be.an('array')
        done()
      }
    )
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
