/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const expect = require('chai').expect

const UPSERT_STATE_MACHINE = 'tymlyTest_upsert'
const WAIT_AND_UPSERT_STATE_MACHINE = 'tymlyTest_waitAndUpsert'
const LONG_WAIT_AND_UPSERT_STATE_MACHINE = 'tymlyTest_longWaitAndUpsert'

describe('Inject userId through statebox service', function () {
  this.timeout(process.env.TIMEOUT || 30000)
  let tymlyService, statebox

  describe('start up', () => {
    it('boot tymly', done => {
      tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/wait-and-upsert-blueprint')
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
  })

  let quickMachine
  let slowMachine
  let verySlowMachine

  describe('fire off state machines', () => {
    it('long wait, upsert and fetch', async () => {
      const execDescription = await statebox.startExecution(
        {
          person: {
            'employeeNo': '1002',
            'firstName': 'Raymond',
            'lastName': 'Chandler'
          }
        },
        LONG_WAIT_AND_UPSERT_STATE_MACHINE,
        { }
      )

      expect(execDescription.status).to.eql('RUNNING')

      verySlowMachine = execDescription.executionName
    })

    it('wait, upsert and fetch', async () => {
      const execDescription = await statebox.startExecution(
        {
          person: {
            'employeeNo': '1001',
            'firstName': 'Dashiell',
            'lastName': 'Hammett'
          }
        },
        WAIT_AND_UPSERT_STATE_MACHINE,
        { }
      )

      expect(execDescription.status).to.eql('RUNNING')

      slowMachine = execDescription.executionName
    })

    it('upsert and fetch', async () => {
      const execDescription = await statebox.startExecution(
        {
          person: {
            'employeeNo': '1000',
            'firstName': 'Jim',
            'lastName': 'Thompson'
          }
        },
        UPSERT_STATE_MACHINE,
        { }
      )

      expect(execDescription.status).to.eql('RUNNING')

      quickMachine = execDescription.executionName
    })
  })

  describe('wait for state machines to finish', () => {
    it('upsert and fetch', async () => {
      const executionDescription = await statebox.waitUntilStoppedRunning(quickMachine)

      expect(executionDescription.status).to.eql('SUCCEEDED')
    })
    it('wait, upsert and fetch', async () => {
      const executionDescription = await statebox.waitUntilStoppedRunning(slowMachine)

      expect(executionDescription.status).to.eql('SUCCEEDED')
    })
    it('long wait, upsert and fetch', async () => {
      const executionDescription = await statebox.waitUntilStoppedRunning(verySlowMachine)

      expect(executionDescription.status).to.eql('SUCCEEDED')
    })
  })

  describe('shutdown', () => {
    it('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })
})
