/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const expect = chai.expect

const UNIQUE_KEY = 'tymlyTest_findByUniqueKey_1_0'
const MULTIPLE_UNIQUE_KEYS = 'tymlyTest_findByMultipleUniqueKeys_1_0'
const COMPOSITE_KEY = 'tymlyTest_findByCompositeKey_1_0'
const MULTIPLE_COMPOSITE_KEYS = 'tymlyTest_findByMultipleCompositeKeys_1_0'

describe('FindById and FindByIds State Resources', function () {
  this.timeout(process.env.TIMEOUT || 5000)
  let tymlyService, statebox

  before('boot tymly', async () => {
    const tymlyServices = await tymly.boot({
      blueprintPaths: [
        path.resolve(__dirname, './fixtures/blueprints/find-by-id-blueprint')
      ]
    })

    tymlyService = tymlyServices.tymly
    statebox = tymlyServices.statebox
  })

  it('find by unique key', async () => {
    const executionDescription = await statebox.startExecution(
      { id: '101' },
      UNIQUE_KEY,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx.found).to.containSubset({
      id: '101',
      name: 'Billy',
      animal: 'Dog'
    })
  })

  it('find by unique key, passing array', async () => {
    const executionDescription = await statebox.startExecution(
      { id: ['101'] },
      UNIQUE_KEY,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx.found).to.containSubset({
      id: '101',
      name: 'Billy',
      animal: 'Dog'
    })
  })

  it('find by multiple unique keys', async () => {
    const executionDescription = await statebox.startExecution(
      { ids: ['101', '99X'] },
      MULTIPLE_UNIQUE_KEYS,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx.found).to.containSubset([{
      id: '101',
      name: 'Billy',
      animal: 'Dog'
    },{
      id: '99X',
      name: 'Babu',
      animal: 'Red Panda'
    }])
  })

  it('find by multiple unique keys, passing array', async () => {
    const executionDescription = await statebox.startExecution(
      { ids: [['101'],['99X']] },
      MULTIPLE_UNIQUE_KEYS,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx.found).to.containSubset([{
      id: '101',
      name: 'Billy',
      animal: 'Dog'
    },{
      id: '99X',
      name: 'Babu',
      animal: 'Red Panda'
    }])
  })

  it('find by composite key', async () => {
    const executionDescription = await statebox.startExecution(
      { key: { name: 'Billy', animal: 'Dog' } },
      COMPOSITE_KEY,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx.found).to.containSubset({
      name: 'Billy',
      animal: 'Dog',
      colour: 'orange'
    })
  })

  it('find by composite key, passing array', async () => {
    const executionDescription = await statebox.startExecution(
      { key: ['Billy', 'Dog'] },
      COMPOSITE_KEY,
      {
        sendResponse: 'COMPLETE'
      }
    )

    console.log(JSON.stringify(executionDescription, null, 2))
    expect(executionDescription.ctx.found).to.containSubset({
      name: 'Billy',
      animal: 'Dog',
      colour: 'orange'
    })
  })

  it('find by multiple composite keys', async () => {
    const executionDescription = await statebox.startExecution(
      { keys: [{ name: 'Billy', animal: 'Dog' }, { name: 'Babu', animal: 'Red Panda' }] },
      MULTIPLE_COMPOSITE_KEYS,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(executionDescription.ctx.found).to.containSubset([{
      name: 'Billy',
      animal: 'Dog',
      colour: 'orange'
    },{
      name: 'Babu',
      animal: 'Red Panda',
      colour: 'Auburn'
    }])
  })

  it('find by multiple composite keys, passing array', async () => {
    const executionDescription = await statebox.startExecution(
      { keys: [['Billy', 'Dog'],['Babu', 'Red Panda']] },
      MULTIPLE_COMPOSITE_KEYS,
      {
        sendResponse: 'COMPLETE'
      }
    )

    console.log(JSON.stringify(executionDescription, null, 2))
    expect(executionDescription.ctx.found).to.containSubset([{
      name: 'Billy',
      animal: 'Dog',
      colour: 'orange'
    },{
      name: 'Babu',
      animal: 'Red Panda',
      colour: 'Auburn'
    }])
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
