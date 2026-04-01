/* eslint-env mocha */

const path = require('path')
const expect = require('chai').expect
const tymly = require('../lib')
const moment = require('moment')

const stateMachines = {
  now: 'tymlyTest_timestampNow_1_0',
  today: 'tymlyTest_timestampToday_1_0',
  year: 'tymlyTest_timestampYear_1_0',
  format: 'tymlyTest_timestampFormat_1_0'
}

const todayCheck = moment().hour(0).minute(0).second(0).millisecond(0)
const yearCheck = moment().format('yyyy')

describe('Timestamp state resources', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let statebox

  it('boot Tymly', function (done) {
    tymly.boot(
      {
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/timestamp-blueprint')
        ],
        pluginPaths: [
          path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
        ]
      },
      function (err, tymlyServices) {
        if (err) return done(err)
        tymlyService = tymlyServices.tymly
        statebox = tymlyServices.statebox

        done()
      }
    )
  })

  it('run the state machine to get a timestamp for now', async () => {
    const execDesc = await statebox.startExecution(
      {},
      stateMachines.now,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDesc.ctx.timestamp).to.not.eql(null)
  })

  it('run the state machine to get a timestamp for today', async () => {
    const execDesc = await statebox.startExecution(
      { query: '$TODAY' },
      stateMachines.today,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDesc.ctx.timestamp.format()).to.eql(todayCheck.format())
  })

  it('run the state machine to get a timestamp for the year', async () => {
    const execDesc = await statebox.startExecution(
      { query: '$YEAR' },
      stateMachines.year,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDesc.ctx.timestamp).to.eql(yearCheck)
  })

  it('run the state machine to get a formatted timestamp', async () => {
    const date = moment().date(1).month(0).year(2020)

    const execDesc = await statebox.startExecution(
      { timestamp: date, format: 'DD/MM/YY' },
      stateMachines.format,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDesc.ctx.timestamp).to.eql('01/01/20')
  })

  it('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
