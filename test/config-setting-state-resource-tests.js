/* eslint-env mocha */

const path = require('path')
const expect = require('chai').expect
const tymly = require('../lib')

describe('Config Setting state resources', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let statebox

  it('boot Tymly', async () => {
    const services = await tymly.boot(
      {
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/config-setting-blueprint')
        ],
        pluginPaths: [
          path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
        ],
        config: {
          values: {
            string: 'good',
            integer: 123,
            bool: true
          }
        }
      }
    )

    tymlyService = services.tymly
    statebox = services.statebox
  })

  const goodTests = [
    ['string', 'good'],
    ['integer', 123],
    ['bool', true],
    ['unspecified', undefined]
  ]

  for (const [name, expected] of goodTests) {
    it(`fetch ${name} config setting`, async () => {
      const execDesc = await statebox.startExecution(
        {},
        `tymlyTest_${name}ConfigSetting_1_0`,
        { sendResponse: 'COMPLETE' }
      )
      expect(execDesc.ctx.setting).to.eql(expected)
    })
  }

  it('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
