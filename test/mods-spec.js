/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('./../lib')
const path = require('path')

describe('Mods tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService, blueprintComponents

  before('boot Tymly', async () => {
    const tymlyServices = await tymly.boot({
      blueprintPaths: [
        path.resolve(__dirname, './fixtures/blueprints/mod-blueprint')
      ],
      modPaths: [
        path.resolve(__dirname, './fixtures/mods/example-mod')
      ]
    })

    tymlyService = tymlyServices.tymly
    blueprintComponents = tymlyService.blueprintComponents
  })

  /*
 TODO scenarios:
 * card-templates add/remove/replace/using refs
 * state-machines add/remove/replace/using refs
 */

  it('check the card-template changes for simple operations', () => {
    const cardTemplate = blueprintComponents.cardTemplates.tymlyTest_simpleOperations_1_0
    const body = [
      {
        type: 'TextBlock',
        text: 'Hello world'
      },
      {
        type: 'Container',
        items: [
          {
            type: 'TextBlock',
            text: '0'
          },
          {
            type: 'TextBlock',
            text: '1'
          },
          {
            type: 'TextBlock',
            text: '2'
          }
        ]
      }
    ]
    const actions = [
      {
        type: 'Action.Cancel',
        title: 'Cancel'
      }
    ]
    expect(cardTemplate.body).to.eql(body)
    expect(cardTemplate.actions).to.eql(actions)
  })

  it('check the model changes', () => {
    const { properties } = blueprintComponents.models.tymlyTest_orders
    const expected = {
      product: { type: 'string' },
      quantity: { type: 'integer' },
      areaCode: { type: 'string' },
      location: { type: 'string' }
    }
    expect(properties).to.eql(expected)
  })

  it('check the image changes', () => {
    const { filePath } = blueprintComponents.images['tymlyTest_smile.png']
    const expected = path.resolve(__dirname, './fixtures/mods/example-mod/images/smile.png')
    expect(filePath).to.eql(expected)
  })

  it('check the function changes', () => {
    const fn = blueprintComponents.functions.tymlyTest_numbersArray
    const expected = require(path.resolve(__dirname, './fixtures/mods/example-mod/functions/numbers-array.js'))
    expect(fn).to.eql(expected)
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
