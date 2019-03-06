/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const expect = require('chai').expect

describe('Category tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let categoryService

  before('load the cat blueprint (which has some registry keys)', async () => {
    const tymlyServices = await tymly.boot({
      blueprintPaths: [
        path.resolve(__dirname, './fixtures/blueprints/cats-blueprint')
      ],

      pluginPaths: [
        path.resolve(__dirname, './fixtures/plugins/cats-plugin')
      ]
    })

    tymlyService = tymlyServices.tymly
    categoryService = tymlyServices.categories
  })

  it('check cat tag', () => {
    expect(categoryService.categories.cat).to.eql(
      {
        category: 'cat',
        label: 'Cat',
        styling: {
          'background-color': '#5F5F5F'
        }
      }
    )
  })

  it('check pet tag', () => {
    expect(categoryService.categories.pet).to.eql(
      {
        category: 'pet',
        label: 'Pet',
        styling: {
          'background-color': '#80C342'
        }
      }
    )
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
