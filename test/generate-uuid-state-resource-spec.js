/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const expect = require('chai').expect

const STATE_MACHINE_NAME = 'tymlyTest_generateUuid'

describe('Generate uuid state resource', function () {
  this.timeout(process.env.TIMEOUT || 5000)
  let tymlyService, statebox

  before('boot tymly', done => {
    tymly.boot(
      {
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/uuid-blueprint')
        ]
      },
      (err, tymlyServices) => {
        expect(err).to.eql(null)
        tymlyService = tymlyServices.tymly
        statebox = tymlyServices.statebox
        done()
      }
    )
  })

  it('run the state machine', async () => {
    const executionDescription = await statebox.startExecution(
      {},
      STATE_MACHINE_NAME,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx.shortId.id.length).to.eql(8)
    expect(executionDescription.ctx.shorterId.id.length).to.eql(5)
    expect(executionDescription.ctx.longerId.id.length).to.eql(36)
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
