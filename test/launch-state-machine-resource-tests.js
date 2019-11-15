/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const DAY_IN_THE_LIFE_LAUNCHER = 'tymlyTest_launchADayInTheLife'
const DAY_IN_THE_LIFE = 'tymlyTest_aDayInTheLife'
const JUSTFAIL_LAUNCHER = 'tymlyTest_launchJustFail'
const JUSTFAIL = 'tymlyTest_justFail'

describe('Launch-state-machine state resources', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  describe('launched state machines runs successfully', () => {
    let tymlyService
    let statebox
    let launched

    before('boot tymly', function (done) {
      tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/cats-blueprint'),
            path.resolve(__dirname, './fixtures/blueprints/cats-launcher-blueprint')
          ],

          pluginPaths: [
            path.resolve(__dirname, './fixtures/plugins/cats-plugin'),
            path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
          ]
        },
        function (err, tymlyServices) {
          expect(err).to.eql(null)
          tymlyService = tymlyServices.tymly
          statebox = tymlyServices.statebox
          done()
        }
      )
    })

    it('launcher completes successfully', async () => {
      const executionDescription = await statebox.startExecution(
        {
          petName: 'Rupert',
          gender: 'male',
          hoursSinceLastMotion: 11,
          hoursSinceLastMeal: 5,
          petDiary: []
        }, // input
        DAY_IN_THE_LIFE_LAUNCHER, // state machine name
        {
          sendResponse: 'COMPLETE'
        }
      )

      expect(executionDescription.status).to.eql('SUCCEEDED')
      expect(executionDescription.stateMachineName).to.eql(DAY_IN_THE_LIFE_LAUNCHER)
      expect(executionDescription.currentStateName).to.eql('Start')

      const launchedResult = executionDescription.ctx.launched
      expect(launchedResult).to.not.be.null()
      expect(launchedResult.executionName).to.not.be.null()
      expect(launchedResult.status).to.eql('RUNNING')
      expect(launchedResult.startDate).to.not.be.null()

      launched = launchedResult.executionName
    })

    it('launched state machine completes successfully', async () => {
      const executionDescription = await statebox.waitUntilStoppedRunning(launched)

      expect(executionDescription.status).to.eql('SUCCEEDED')
      expect(executionDescription.stateMachineName).to.eql(DAY_IN_THE_LIFE)
      expect(executionDescription.ctx.hoursSinceLastMeal).to.eql(0)
      expect(executionDescription.ctx.hoursSinceLastMotion).to.eql(0)
      expect(executionDescription.ctx.gender).to.eql('male')
      expect(executionDescription.ctx.petDiary).to.be.an('array')
      expect(executionDescription.ctx.petDiary[0]).to.equal('Look out, Rupert is waking up!')
      expect(executionDescription.ctx.petDiary[2]).to.equal('Rupert is walking... where\'s he off to?')
      expect(executionDescription.ctx.petDiary[6]).to.equal('Shh, Rupert is eating...')
    })

    after('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })

  describe('launched state machine doesn\'t exist', () => {
    let tymlyService
    let statebox
    let launcher

    before('boot tymly', function (done) {
      tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/cats-launcher-blueprint')
          ],
          pluginPaths: [
            path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
          ]
        },
        function (err, tymlyServices) {
          expect(err).to.eql(null)
          tymlyService = tymlyServices.tymly
          statebox = tymlyServices.statebox
          done()
        }
      )
    })

    it('start launcher', async () => {
      const result = await statebox.startExecution(
        {
          petName: 'Rupert',
          gender: 'male',
          hoursSinceLastMotion: 11,
          hoursSinceLastMeal: 5,
          petDiary: []
        }, // input
        DAY_IN_THE_LIFE_LAUNCHER, // state machine name
        {}
      )

      launcher = result.executionName
    })

    it('launcher failed', async () => {
      const executionDescription = await statebox.waitUntilStoppedRunning(launcher)

      expect(executionDescription.status).to.eql('FAILED')
      expect(executionDescription.errorCode).to.eql('launchStateMachine')
      expect(executionDescription.stateMachineName).to.eql(DAY_IN_THE_LIFE_LAUNCHER)
      expect(executionDescription.currentStateName).to.eql('Start')
    })

    after('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })

  describe('launched state machine fails', () => {
    let tymlyService
    let statebox
    let launched

    before('boot tymly', function (done) {
      tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/failing-blueprint')
          ],
          pluginPaths: [
            path.resolve(__dirname, './fixtures/plugins/justfail-plugin'),
            path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
          ]
        },
        function (err, tymlyServices) {
          expect(err).to.eql(null)
          tymlyService = tymlyServices.tymly
          statebox = tymlyServices.statebox
          done()
        }
      )
    })

    it('launcher completes successfully', async () => {
      const executionDescription = await statebox.startExecution(
        { }, // input
        JUSTFAIL_LAUNCHER, // state machine name
        {
          sendResponse: 'COMPLETED'
        }
      )

      expect(executionDescription.status).to.eql('SUCCEEDED')
      expect(executionDescription.stateMachineName).to.eql(JUSTFAIL_LAUNCHER)
      expect(executionDescription.currentStateName).to.eql('Start')

      const launchedResult = executionDescription.ctx
      expect(launchedResult).to.not.be.null()
      expect(launchedResult.executionName).to.not.be.null()
      expect(launchedResult.status).to.eql('RUNNING')
      expect(launchedResult.startDate).to.not.be.null()

      launched = launchedResult.executionName
    })

    it('launched state machine fails', async () => {
      const executionDescription = await statebox.waitUntilStoppedRunning(launched)

      expect(executionDescription.status).to.eql('FAILED')
      expect(executionDescription.errorCode).to.eql('justFail')
      expect(executionDescription.stateMachineName).to.eql(JUSTFAIL)
      expect(executionDescription.currentStateName).to.eql('JustFail')
    })

    after('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })

  describe('launched state machine gets parent execution name', () => {
    let tymlyService
    let statebox
    let launcher
    let launched

    it('boot tymly', async () => {
      const tymlyServices = await tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/launcher-blueprint')
          ],
          pluginPaths: [
            path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
          ]
        }
      )
      tymlyService = tymlyServices.tymly
      statebox = tymlyServices.statebox
    })

    it('launch state machine', async () => {
      const executionDescription = await statebox.startExecution(
        { }, // input
        'tymlyTest_passExecutionNameToLaunched', // state machine name
        {
          sendResponse: 'COMPLETE'
        }
      )

      expect(executionDescription.status).to.eql('SUCCEEDED')

      const launchedResult = executionDescription.ctx
      expect(launchedResult).to.not.be.null()
      expect(launchedResult.executionName).to.not.be.null()

      launched = launchedResult.executionName
      launcher = executionDescription.executionName
    })

    it('launched state machine returns parent execution name', async () => {
      const executionDescription = await statebox.waitUntilStoppedRunning(launched)

      expect(executionDescription.status).to.eql('SUCCEEDED')

      expect(executionDescription.executionName).to.eql(launched)
      expect(executionDescription.ctx).to.eql(launcher)
    })

    after('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })

  describe('launched state machine sends result to parent execution', async () => {
    let tymlyService
    let statebox
    let parent
    let launched
    let launchedResult

    before('boot tymly', async () => {
      const tymlyServices = await tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/launcher-blueprint')
          ],
          pluginPaths: [
            path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
          ]
        }
      )
      tymlyService = tymlyServices.tymly
      statebox = tymlyServices.statebox
    })

    it('launch state machine', async () => {
      const parentExecDesc = await statebox.startExecution(
        { }, // input
        'tymlyTest_parentWaitsForResult', // state machine name
        { }
      )

      parent = parentExecDesc.executionName
    })

    it('launcher is paused, waiting for result', async () => {
      const parentExecDesc = await statebox.describeExecution(parent)
      expect(parentExecDesc.status).to.eql('RUNNING')

      launched = parentExecDesc.ctx.executionName
    })

    it('wait for launched state machine to complete', async () => {
      const launchedExecDesc = await statebox.waitUntilStoppedRunning(launched)

      expect(launchedExecDesc.status).to.eql('SUCCEEDED')
      expect(launchedExecDesc.executionName).to.eql(launched)

      launchedResult = launchedExecDesc.ctx
    })

    it('launcher completes, returning result passed back from launched', async () => {
      const parentExecDesc = await statebox.waitUntilStoppedRunning(parent)

      expect(parentExecDesc.status).to.eql('SUCCEEDED')
      expect(parentExecDesc.executionName).to.eql(parent)

      expect(parentExecDesc.ctx.launchedResult).to.eql(launchedResult)
    })

    after('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })

  describe('awaitingExternalInput state resource', async () => {
    let tymlyService
    let statebox

    before('boot tymly', async () => {
      const tymlyServices = await tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/launcher-blueprint')
          ],
          pluginPaths: [
            path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
          ]
        }
      )
      tymlyService = tymlyServices.tymly
      statebox = tymlyServices.statebox
    })

    it('time out and continue', async () => {
      const parentExecDesc = await statebox.startExecution(
        { }, // input
        'tymlyTest_waitTimesOutAndContinue', // state machine name
        {
          sendResponse: 'COMPLETED'
        }
      )
      expect(parentExecDesc.status).to.eql('SUCCEEDED')
      expect(parentExecDesc.ctx.launchedResult).to.eql('time-out')
      expect(parentExecDesc.ctx.good).to.eql('stuff')
    })

    it('time out and fail', async () => {
      const parentExecDesc = await statebox.startExecution(
        {}, // input
        'tymlyTest_waitTimesOutAndFail', // state machine name
        {
          sendResponse: 'COMPLETED'
        }
      )
      expect(parentExecDesc.status).to.eql('FAILED')
    })

    after('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })

  describe('sendTaskSuccess state resource', async () => {
    let tymlyService
    let statebox

    before('boot tymly', async () => {
      const tymlyServices = await tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/launcher-blueprint')
          ],
          pluginPaths: [
            path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
          ]
        }
      )
      tymlyService = tymlyServices.tymly
      statebox = tymlyServices.statebox
    })

    it('fails if invalid execution name', async () => {
      const executionDescription = await statebox.startExecution(
        { }, // input
        'tymlyTest_launchedSendsResultToParent', // state machine name
        {
          sendResponse: 'COMPLETE'
        }
      )

      expect(executionDescription.status).to.eql('FAILED')
    })

    it('doesn\'t fail if invalid execution name when relaxed is true', async () => {
      const executionDescription = await statebox.startExecution(
        { }, // input
        'tymlyTest_relaxedSendTaskSuccess', // state machine name
        {
          sendResponse: 'COMPLETE'
        }
      )

      expect(executionDescription.status).to.eql('SUCCEEDED')
    })

    after('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })

  describe('sendTaskHeartbeat state resource', async () => {
    let tymlyService
    let statebox
    let parentExecution

    before('boot tymly', async () => {
      const tymlyServices = await tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/launcher-blueprint')
          ],
          pluginPaths: [
            path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
          ]
        }
      )
      tymlyService = tymlyServices.tymly
      statebox = tymlyServices.statebox
    })

    it('launched execution sends heartbeat to parent', async () => {
      const executionDescription = await statebox.startExecution(
        { }, // input
        'tymlyTest_parentGetsUpdates', // state machine name
        {
          sendResponse: 'IMMEDIATELY'
        }
      )

      parentExecution = executionDescription.executionName
      expect(executionDescription.status).to.eql('RUNNING')
    })

    it('check for first update', async () => {
      await pause()

      const executionDescription = await statebox.describeExecution(parentExecution)
      expect(executionDescription.status).to.eql('RUNNING')
      expect(executionDescription.ctx.launchedResult).to.equals('STARTED')
    })

    it('wait for second update', async () => {
      await pause()
      await pause()

      const executionDescription = await statebox.describeExecution(parentExecution)
      expect(executionDescription.status).to.eql('RUNNING')
      expect(executionDescription.ctx.launchedResult).to.equals('UPDATED')
    })

    it('complete the parent execution', async () => {
      const executionDescription = await statebox.sendTaskSuccess(
        parentExecution,
        null,
        {}
      )

      expect(executionDescription.status).to.eql('SUCCEEDED')
    })

    after('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })
})

function pause () {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 1000)
  })
}
