/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('./../lib')
const path = require('path')

describe('Mods tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService

  before('boot Tymly', async () => {
    const tymlyServices = await tymly.boot({
      blueprintPaths: [
        path.resolve(__dirname, './fixtures/blueprints/simpsons-blueprint'),
        path.resolve(__dirname, './fixtures/blueprints/space-blueprint'),
        path.resolve(__dirname, './fixtures/blueprints/people-blueprint')
      ],
      modPaths: [
        path.resolve(__dirname, './fixtures/mods/simpsons-mod')
      ]
    })

    tymlyService = tymlyServices.tymly
  })

  it('ensure components have updated as per mods', () => {
    const actualModel = tymlyService.blueprintComponents.models.tymlyTest_moesDrinksOrders
    const expectedModel = require('./expected/moes-drinks-orders-model')
    expect(actualModel).to.eql(expectedModel)

    const actualCardTemplate = tymlyService.blueprintComponents.cardTemplates.tymlyTest_orderAtMoes_1_0
    const expectedCardTemplate = require('./expected/moes-drinks-orders-card-template')
    expect(actualCardTemplate).to.eql(expectedCardTemplate)
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
