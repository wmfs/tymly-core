/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const expect = require('chai').expect
const STATE_MACHINE_NAME = 'tymlyTest_aDayInTheLife'

describe('Statebox Service', function () {
  let tymlyService
  let statebox
  this.timeout(process.env.TIMEOUT || 5000)
  let rupert

  describe('start up', () => {
    it('create some basic tymly services to run a simple cat blueprint', function (done) {
      tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/cats-blueprint'),
            path.resolve(__dirname, './fixtures/blueprints/it-lives-blueprint')
          ],

          pluginPaths: [
            path.resolve(__dirname, './fixtures/plugins/cats-plugin'),
            path.resolve(__dirname, './fixtures/plugins/it-lives-plugin'),
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
  })

  describe('find things', () => {
    it('find cat state machine', function () {
      const stateMachine = statebox.findStateMachineByName(STATE_MACHINE_NAME)
      expect(stateMachine.name).to.eql(STATE_MACHINE_NAME)
    })

    it('fail finding dog state machine', function () {
      const stateMachine = statebox.findStateMachineByName('DOGS!')
      expect(stateMachine).to.be.an('undefined')
    })
  })

  describe('run state machine', () => {
    it('execute cat state machine', function (done) {
      statebox.startExecution(
        {
          petName: 'Rupert',
          gender: 'male',
          hoursSinceLastMotion: 11,
          hoursSinceLastMeal: 5,
          petDiary: []
        }, // input
        STATE_MACHINE_NAME, // state machine name
        {}, // options
        function (err, result) {
          expect(err).to.eql(null)
          rupert = result.executionName
          done()
        }
      )
    })

    it('successfully complete Rupert\'s day', function (done) {
      statebox.waitUntilStoppedRunning(
        rupert,
        function (err, executionDescription) {
          expect(err).to.eql(null)
          expect(executionDescription.status).to.eql('SUCCEEDED')
          expect(executionDescription.stateMachineName).to.eql('tymlyTest_aDayInTheLife')
          expect(executionDescription.currentStateName).to.eql('Sleeping')
          expect(executionDescription.ctx.hoursSinceLastMeal).to.eql(0)
          expect(executionDescription.ctx.hoursSinceLastMotion).to.eql(0)
          expect(executionDescription.ctx.gender).to.eql('male')
          expect(executionDescription.ctx.petDiary).to.be.an('array')
          expect(executionDescription.ctx.petDiary[0]).to.equal('Look out, Rupert is waking up!')
          expect(executionDescription.ctx.petDiary[2]).to.equal('Rupert is walking... where\'s he off to?')
          expect(executionDescription.ctx.petDiary[6]).to.equal('Shh, Rupert is eating...')
          done()
        }
      )
    })
  })

  describe('can\'t run things which don\'t exist', () => {
    it('fail to execute dog state machine', function (done) {
      statebox.startExecution(
        {
          dogName: 'Scooby',
          gender: 'male',
          hoursSinceLastMotion: 1,
          hoursSinceLastMeal: 0,
          petDiary: []
        }, // input
        'DOG_MACHINE', // state machine name
        {}, // options
        function (err, result) {
          expect(err).to.eql(null)
          expect(result.errorMessage).to.eql('Unknown stateMachine with name \'DOG_MACHINE\'')
          done()
        }
      )
    })
  })

  describe('fail, come back to life, succeed', () => {
    let executionName

    it('start', async () => {
      const executionDescription = await statebox.startExecution(
        {}, // input
        'tymlyTest_helloFailButLiveAgain', // state machine name
        {} // options
      )

      executionName = executionDescription.executionName
    })

    it('oh dear', async () => {
      const executionDescription = await statebox.waitUntilStoppedRunning(executionName)

      expect(executionDescription.status).to.eql('FAILED')
      expect(executionDescription.stateMachineName).to.eql('tymlyTest_helloFailButLiveAgain')
      expect(executionDescription.currentStateName).to.eql('Stuttery')
    })

    it('raise from the grave', async () => {
      await statebox.sendTaskRevivification(
        executionName,
        {}
      )
    })

    it('it lives', async () => {
      const executionDescription = await statebox.waitUntilStoppedRunning(executionName)

      expect(executionDescription.status).to.eql('SUCCEEDED')
      expect(executionDescription.stateMachineName).to.eql('tymlyTest_helloFailButLiveAgain')
      expect(executionDescription.currentStateName).to.eql('IT-LIVES')
    })
  })

  describe('clean up', () => {
    it('shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })
})
