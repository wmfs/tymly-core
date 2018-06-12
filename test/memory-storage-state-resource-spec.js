/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('../lib')
const path = require('path')
const UPSERT_FIND_STATE_MACHINE_NAME = 'tymlyTest_upsertACatFindACat_1_0'
const FIND_WHERE_STATE_MACHINE_NAME = 'tymlyTest_findACatWhere_1_0'
const DELETE_STATE_MACHINE_NAME = 'tymlyTest_deleteACat_1_0'
const DELETE_OBJ_PK_STATE_MACHINE_NAME = 'tymlyTest_deleteADog_1_0'

describe('State resource tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService, statebox, catModel, dogModel

  it('should boot Tymly', done => {
    tymly.boot(
      {
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/storage-blueprint')
        ],
        pluginPaths: [
          path.resolve(__dirname, '../node_modules/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
        ]
      },
      (err, tymlyServices) => {
        expect(err).to.eql(null)
        tymlyService = tymlyServices.tymly
        statebox = tymlyServices.statebox
        catModel = tymlyServices.storage.models['tymlyTest_cat_1_0']
        dogModel = tymlyServices.storage.models['tymlyTest_dog_1_0']
        done()
      }
    )
  })

  it('should find the simple-storage state-machine by name', () => {
    const stateMachine = statebox.findStateMachineByName(UPSERT_FIND_STATE_MACHINE_NAME)
    expect(stateMachine.name).to.eql(UPSERT_FIND_STATE_MACHINE_NAME)
  })

  it('should start state machine to upsert and find a cat', async () => {
    const execDesc = await statebox.startExecution(
      {
        catDoc: {
          'name': 'Rupert',
          'size': 'large',
          'comment': 'Stunning.'
        }
      },
      UPSERT_FIND_STATE_MACHINE_NAME,
      {sendResponse: 'COMPLETE'}
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.stateMachineName).to.eql(UPSERT_FIND_STATE_MACHINE_NAME)
    expect(execDesc.currentStateName).to.eql('FindingOne')
    expect(execDesc.ctx.catDocFromStorage.name).to.eql('Rupert')
    expect(execDesc.ctx.catDocFromStorage.size).to.eql('large')
    expect(execDesc.ctx.catDocFromStorage.comment).to.eql('Stunning.')
  })

  it('should upsert some animals', async () => {
    await catModel.upsert({name: 'Wilfred'}, {})
    await dogModel.upsert({name: 'Alfie', id: 1}, {})
  })

  it('should start a simple-storage Tymly with correct name', async () => {
    const execDesc = await statebox.startExecution(
      {catName: 'Wilfred'},
      FIND_WHERE_STATE_MACHINE_NAME,
      {sendResponse: 'COMPLETE'}
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.stateMachineName).to.eql(FIND_WHERE_STATE_MACHINE_NAME)
    expect(execDesc.currentStateName).to.eql('FindingWilfred')
    expect(execDesc.ctx.catDocFromStorage[0].name).to.eql('Rupert')
    expect(execDesc.ctx.anotherCatDocFromStorage[0].name).to.eql('Wilfred')
  })

  it('should start state machine to test the DeletingById state resource', async () => {
    const execDesc = await statebox.startExecution(
      {catName: 'Wilfred'},
      DELETE_STATE_MACHINE_NAME,
      {sendResponse: 'COMPLETE'}
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('DeletingWilfred')
    expect(execDesc.currentResource).to.eql('module:deletingById')
  })

  it('should check the cat has been deleted', async () => {
    const cat = await catModel.findById('Wilfred')
    expect(cat).to.eql(undefined)
  })

  it('should start state machine to test the DeletingById state resource passing in an object', async () => {
    const execDesc = await statebox.startExecution(
      {dog: {name: 'Alfie', id: 1}},
      DELETE_OBJ_PK_STATE_MACHINE_NAME,
      {sendResponse: 'COMPLETE'}
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('DeletingAlfie')
    expect(execDesc.currentResource).to.eql('module:deletingById')
  })

  it('should check the dog has been deleted', async () => {
    const dog = await dogModel.find({})
    expect(dog.length).to.eql(0)
  })

  it('should shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
