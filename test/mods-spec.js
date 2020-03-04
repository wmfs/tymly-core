/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('./../lib')
const path = require('path')

describe('Mods tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  const expectedPath = './expected/simpsons-blueprint'

  let tymlyService, models, cardTemplates, functions, images

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

    const { blueprintComponents } = tymlyService

    models = blueprintComponents.models
    cardTemplates = blueprintComponents.cardTemplates
    functions = blueprintComponents.functions
    images = blueprintComponents.images
  })

  it('simple card template operations', () => {
    const actual = cardTemplates.tymlyTest_orderAtMoes_1_0
    const expected = require(`${expectedPath}/card-templates/order-at-moes.json`)
    expect(actual).to.eql(expected)
  })

  it('simple model operations', () => {
    const actual = models.tymlyTest_moesDrinksOrders
    const expected = require(`${expectedPath}/models/moes-drinks-orders.json`)
    expect(actual).to.eql(expected)
  })

  it('remove operation', () => {
    const actual = cardTemplates.tymlyTest_toRemove_1_0
    const expected = require(`${expectedPath}/card-templates/to-remove.json`)
    expect(actual).to.eql(expected)
  })

  it('replace function', () => {
    const actual = functions.tymlyTest_helloWorldFunction
    const expected = require(`${expectedPath}/functions/hello-world-function.js`)
    expect(actual()()).to.eql(expected()())
  })

  it('replace image', () => {
    const actual = images['tymlyTest_simpsons.png'].filePath
    const expected = path.resolve(__dirname, './fixtures/mods/simpsons-mod/images/simpsons.png')
    expect(actual).to.eql(expected)
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
