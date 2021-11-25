/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('../lib')
const path = require('path')
const UPSERT_FIND_STATE_MACHINE_NAME = 'tymlyTest_upsertACatFindACat_1_0'
const FIND_WHERE_STATE_MACHINE_NAME = 'tymlyTest_findACatWhere_1_0'
const FIND_BY_ID_STATE_MACHINE_NAME = 'tymlyTest_findACatById_1_0'
const FIND_BY_ID_OBJ_PK_STATE_MACHINE_NAME = 'tymlyTest_findADogById_1_0'
const DELETE_STATE_MACHINE_NAME = 'tymlyTest_deleteACat_1_0'
const DELETE_OBJ_PK_STATE_MACHINE_NAME = 'tymlyTest_deleteADog_1_0'
const SEARCH_CATS_STATE_MACHINE_NAME = 'tymlyTest_searchCats_1_0'

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
          path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
        ]
      },
      (err, tymlyServices) => {
        expect(err).to.eql(null)
        tymlyService = tymlyServices.tymly
        statebox = tymlyServices.statebox
        catModel = tymlyServices.storage.models.tymlyTest_cat_1_0
        dogModel = tymlyServices.storage.models.tymlyTest_dog_1_0
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
          name: 'Rupert',
          size: 'large',
          comment: 'Stunning.'
        }
      },
      UPSERT_FIND_STATE_MACHINE_NAME,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.stateMachineName).to.eql(UPSERT_FIND_STATE_MACHINE_NAME)
    expect(execDesc.currentStateName).to.eql('FindingOne')
    expect(execDesc.ctx.catDocFromStorage.name).to.eql('Rupert')
    expect(execDesc.ctx.catDocFromStorage.size).to.eql('large')
    expect(execDesc.ctx.catDocFromStorage.comment).to.eql('Stunning.')
  })

  it('should upsert some animals', async () => {
    await catModel.upsert({ name: 'Wilfred' }, {})
    await dogModel.upsert({ name: 'Alfie', id: 1 }, {})
    await dogModel.upsert({ name: 'Donald', id: 2 }, {})
  })

  it('should start a simple-storage Tymly with correct name', async () => {
    const execDesc = await statebox.startExecution(
      { catName: 'Wilfred' },
      FIND_WHERE_STATE_MACHINE_NAME,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.stateMachineName).to.eql(FIND_WHERE_STATE_MACHINE_NAME)
    expect(execDesc.currentStateName).to.eql('FindingWilfred')
    expect(execDesc.ctx.catDocFromStorage[0].name).to.eql('Rupert')
    expect(execDesc.ctx.countCatDocFromStorage).to.eql(1)
    expect(execDesc.ctx.anotherCatDocFromStorage[0].name).to.eql('Wilfred')
  })

  it('should start state machine to test the DeletingById state resource', async () => {
    const execDesc = await statebox.startExecution(
      { catName: 'Wilfred' },
      DELETE_STATE_MACHINE_NAME,
      { sendResponse: 'COMPLETE' }
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
      { dog: { name: 'Alfie', id: 1 } },
      DELETE_OBJ_PK_STATE_MACHINE_NAME,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('DeletingAlfie')
    expect(execDesc.currentResource).to.eql('module:deletingById')
  })

  it('should check the dog has been deleted', async () => {
    const dog = await dogModel.find({})
    expect(dog.length).to.eql(1)
  })

  it('should start state machine to test the FindingById state resource', async () => {
    const execDesc = await statebox.startExecution(
      { catName: 'Rupert' },
      FIND_BY_ID_STATE_MACHINE_NAME,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('FindingRupert')
    expect(execDesc.currentResource).to.eql('module:findingById')
    expect(execDesc.ctx.catDocFromStorage.name).to.eql('Rupert')
  })

  it('should start state machine to test the FindingById state resource with an object primary key', async () => {
    const execDesc = await statebox.startExecution(
      { dog: { name: 'Donald', id: 2 } },
      FIND_BY_ID_OBJ_PK_STATE_MACHINE_NAME,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('FindingDonald')
    expect(execDesc.currentResource).to.eql('module:findingById')
    expect(execDesc.ctx.dogDocFromStorage.name).to.eql('Donald')
    expect(execDesc.ctx.dogDocFromStorage.id).to.eql(2)
  })

  it('should start state machine to test the StorageSearch state resource', async () => {
    const execDesc = await statebox.startExecution(
      {},
      SEARCH_CATS_STATE_MACHINE_NAME,
      { sendResponse: 'COMPLETE' }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('Search')
    expect(execDesc.currentResource).to.eql('module:storageSearch')

    expect(execDesc.ctx.page).to.eql(1)
    expect(execDesc.ctx.totalPages).to.eql(1)
    expect(execDesc.ctx.results.length).to.eql(1)
    expect(execDesc.ctx.totalHits).to.eql(1)

    const doc = execDesc.ctx.results[0]
    expect(doc).to.eql({ name: 'Rupert', size: 'large' })
  })

  it('should shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
