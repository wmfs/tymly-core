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

  const tests = [
    {
      title: 'long wait, upsert and fetch',
      person: {
        'employeeNo': '1002',
        'firstName': 'Raymond',
        'lastName': 'Chandler'
      },
      stateMachine: LONG_WAIT_AND_UPSERT_STATE_MACHINE,
      userId: 'El Dragon Azteca Jr'
    },
    {
      title: 'wait, upsert and fetch',
      person: {
        'employeeNo': '1001',
        'firstName': 'Dashiell',
        'lastName': 'Hammett'
      },
      stateMachine: WAIT_AND_UPSERT_STATE_MACHINE,
      userId: 'Fenix'
    },
    {
      title: 'upsert and fetch',
      person: {
        'employeeNo': '1000',
        'firstName': 'Jim',
        'lastName': 'Thompson'
      },
      stateMachine: UPSERT_STATE_MACHINE,
      userId: 'Penta El Zero M'
    }
  ]

  describe('fire off state machines', () => {
    for (const test of tests) {
      it(test.title, async () => {
        const execDescription = await statebox.startExecution(
          {
            person: test.person
          },
          test.stateMachine,
          {
            userId: test.userId
          }
        )

        expect(execDescription.status).to.eql('RUNNING')

        test.execName = execDescription.executionName
      })
    }
  })

  describe('wait for state machines to finish', () => {
    tests.reverse()
    for (const test of tests) {
      it(test.title, async () => {
        const executionDescription = await statebox.waitUntilStoppedRunning(test.execName)

        expect(executionDescription.status).to.eql('SUCCEEDED')
        expect(executionDescription.ctx.upsertedPerson.createdBy).to.eql(test.userId)
      })
    }
  })

  describe('shutdown', () => {
    it('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })
})
