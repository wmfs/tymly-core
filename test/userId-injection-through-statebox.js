/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const expect = require('chai').expect

const UPSERT_STATE_MACHINE = 'tymlyTest_upsert'
const WAIT_AND_UPSERT_STATE_MACHINE = 'tymlyTest_waitAndUpsert'
const LONG_WAIT_AND_UPSERT_STATE_MACHINE = 'tymlyTest_longWaitAndUpsert'

describe('Inject userId through statebox service', function () {
  this.timeout(process.env.TIMEOUT || 30000)
  let tymlyService, statebox, storage, userInfo

  describe('start up', () => {
    it('boot tymly', done => {
      tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/wait-and-upsert-blueprint')
          ],
          pluginPaths: [
            path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin'),
            path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/mock-user-info-plugin')
          ]
        },
        (err, tymlyServices) => {
          expect(err).to.eql(null)
          tymlyService = tymlyServices.tymly
          statebox = tymlyServices.statebox
          storage = tymlyServices.storage
          userInfo = tymlyServices.userInfo
          done()
        }
      )
    })
  })

  function testBatch (label, tests) {
    describe(label, () => {
      describe('fire off state machines', () => {
        it('set mock userInfo', () => {
          for (const test of tests) {
            userInfo.addUser(test.userId, test.userEmail)
          }
        })

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
            expect(executionDescription.ctx.upsertedPerson.createdBy).to.eql(test.userEmail)
          })
        }
      })

      describe('check execution table', () => {
        for (const test of tests) {
          it(test.title, async () => {
            const execution = await storage.models.tymly_execution.findOne({ where: { executionName: { equals: test.execName } } })

            expect(execution.createdBy).to.eql(test.userEmail)
            expect(execution.modifiedBy).to.eql(test.userEmail)
          })
        }
      })
    })
  } // testBatch

  const combination = [
    {
      title: 'long wait, upsert and fetch',
      person: {
        employeeNo: '1002',
        firstName: 'Raymond',
        lastName: 'Chandler'
      },
      stateMachine: LONG_WAIT_AND_UPSERT_STATE_MACHINE,
      userId: 'SuperSlow',
      userEmail: 'super@slow.com'
    },
    {
      title: 'wait, upsert and fetch',
      person: {
        employeeNo: '1001',
        firstName: 'Dashiell',
        lastName: 'Hammett'
      },
      stateMachine: WAIT_AND_UPSERT_STATE_MACHINE,
      userId: 'Slow',
      userEmail: 'snail@slow.com'
    },
    {
      title: 'upsert and fetch',
      person: {
        employeeNo: '1000',
        firstName: 'Jim',
        lastName: 'Thompson'
      },
      stateMachine: UPSERT_STATE_MACHINE,
      userId: 'Speedy',
      userEmail: 'hare@tortoise.com'
    }
  ]

  const speedyspeedy = []
  for (let i = 0; i !== 500; ++i) {
    speedyspeedy.push(
      {
        title: `${i} upsert and fetch`,
        person: {
          employeeNo: `${2000 + i}`
        },
        stateMachine: UPSERT_STATE_MACHINE,
        userId: `Speedy-${i}`,
        userEmail: `user-email-${i}@domain-${i}.test`
      }
    )
  }

  testBatch('Different speeds', combination)
  testBatch('All quick', speedyspeedy)

  describe('shutdown', () => {
    it('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })
})
