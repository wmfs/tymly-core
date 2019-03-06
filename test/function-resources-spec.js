/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const expect = require('chai').expect

const HELLO_WORLD_STATE_MACHINE_NAME = 'tymlyTest_runHelloWorldFunction'
const NORMAL_STATE_MACHINE_NAME = 'tymlyTest_runFunction'
const CALLBACK_STATE_MACHINE_NAME = 'tymlyTest_runCallbackFunction'
const UNKNOWN_STATE_MACHINE_NAME = 'tymlyTest_runUnknownFunction'

describe('Function resources', function () {
  this.timeout(process.env.TIMEOUT || 5000)
  let tymlyService, statebox

  it('boot tymly', done => {
    tymly.boot(
      {
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/function-resource-blueprint')
        ],
        pluginPaths: [
          path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
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

  it('normal function', async () => {
    const execDescription = await statebox.startExecution(
      { options: { name: 'Jim' } },
      NORMAL_STATE_MACHINE_NAME,
      {
        sendResponse: 'COMPLETE',
        userId: 'jimmy2012'
      }
    )

    expect(execDescription.status).to.eql('SUCCEEDED')
    expect(execDescription.ctx.name).to.eql('Jim')
    expect(execDescription.ctx.userId).to.eql('jimmy2012')
  })

  it('hello world function', async () => {
    const execDescription = await statebox.startExecution(
      {},
      HELLO_WORLD_STATE_MACHINE_NAME,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDescription.status).to.eql('SUCCEEDED')
    expect(execDescription.ctx.result).to.eql('Hello World.')
  })

  it('callback function', async () => {
    const execDescription = await statebox.startExecution(
      { options: { age: '28' } },
      CALLBACK_STATE_MACHINE_NAME,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDescription.status).to.eql('SUCCEEDED')
    expect(execDescription.ctx.result).to.eql('Hello World.')
  })

  it('fail with unknown function', async () => {
    const execDescription = await statebox.startExecution(
      {},
      UNKNOWN_STATE_MACHINE_NAME,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDescription.status).to.eql('FAILED')
    expect(execDescription.errorCode).to.eql('UNKNOWN_FUNCTION')
    expect(execDescription.errorMessage).to.eql('Cannot find function: unknownFunction in state machine tymlyTest_runUnknownFunction')
  })

  it('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
