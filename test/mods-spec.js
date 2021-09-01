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

  // todo: state machines

  describe('card templates', () => {
    it('simple operations', () => {
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

    it('change ref to function', () => {
      const cardTemplate = blueprintComponents.cardTemplates.tymlyTest_changeRefToFunction_1_0
      const body = [
        {
          type: 'Container',
          items: [
            {
              type: 'TextBlock',
              text: '1'
            }
          ]
        },
        {
          type: 'Container',
          items: [
            {
              type: 'TextBlock',
              text: 'before'
            },
            {
              type: 'TextBlock',
              text: 'Hello World!!!'
            },
            {
              type: 'TextBlock',
              text: 'after'
            }
          ]
        }
      ]
      expect(cardTemplate.body).to.eql(body)
    })

    it('remove ref to function', () => {
      const cardTemplate = blueprintComponents.cardTemplates.tymlyTest_removeRefToFunction_1_0
      const body = [
        {
          type: 'Container',
          items: [
            {
              type: 'TextBlock',
              text: '1'
            }
          ]
        },
        {
          type: 'Container',
          items: [
            {
              type: 'TextBlock',
              text: 'before'
            },
            {
              type: 'TextBlock',
              text: 'after'
            }
          ]
        }
      ]
      expect(cardTemplate.body).to.eql(body)
    })

    it('add ref to function', () => {
      const cardTemplate = blueprintComponents.cardTemplates.tymlyTest_addRefToFunction_1_0
      const body = [
        {
          type: 'Container',
          items: [
            {
              type: 'TextBlock',
              text: '1'
            }
          ]
        },
        {
          type: 'Container',
          items: [
            {
              type: 'TextBlock',
              text: 'before'
            },
            {
              text: 'Hello World!!!',
              type: 'TextBlock'
            },
            {
              type: 'TextBlock',
              text: 'after'
            }
          ]
        }
      ]
      expect(cardTemplate.body).to.eql(body)
    })

    it('change ref to card template', () => {})

    it('remove ref to card template', () => {})

    it('add ref to card template', () => {})

    it('change ref to directory', () => {})

    it('remove ref to directory', () => {})

    it('add ref to directory', () => {})
  })

  it('models - simple operations', () => {
    const { properties } = blueprintComponents.models.tymlyTest_orders
    const expected = {
      product: { type: 'string' },
      quantity: { type: 'integer' },
      areaCode: { type: 'string' },
      location: { type: 'string' }
    }
    expect(properties).to.eql(expected)
  })

  it('images - replacing', () => {
    const { filePath } = blueprintComponents.images['tymlyTest_smile.png']
    const expected = path.resolve(__dirname, './fixtures/mods/example-mod/images/smile.png')
    expect(filePath).to.eql(expected)
  })

  it('functions - replacing', () => {
    const fn = blueprintComponents.functions.tymlyTest_numbersArray
    const expected = require(path.resolve(__dirname, './fixtures/mods/example-mod/functions/numbers-array.js'))
    expect(fn).to.eql(expected)
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
