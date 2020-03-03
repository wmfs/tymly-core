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
    const expectedPath = './expected/simpsons-blueprint'
    const { models, cardTemplates, functions, images } = tymlyService.blueprintComponents

    const actualModel = models.tymlyTest_moesDrinksOrders
    const expectedModel = require(`${expectedPath}/models/moes-drinks-orders.json`)
    expect(actualModel).to.eql(expectedModel)

    const actualCardTemplate = cardTemplates.tymlyTest_orderAtMoes_1_0
    const expectedCardTemplate = require(`${expectedPath}/card-templates/order-at-moes.json`)
    expect(actualCardTemplate).to.eql(expectedCardTemplate)

    const actualFunction = functions.tymlyTest_helloWorldFunction
    const expectedFunction = require(`${expectedPath}/functions/hello-world-function.js`)
    expect(actualFunction()()).to.eql(expectedFunction()())

    const actualImageFilePath = images['tymlyTest_simpsons.png'].filePath
    const expectedImageFilePath = path.resolve(__dirname, './fixtures/mods/simpsons-mod/images/simpsons.png')
    expect(actualImageFilePath).to.eql(expectedImageFilePath)
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
