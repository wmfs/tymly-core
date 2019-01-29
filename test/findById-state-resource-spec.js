/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const expect = chai.expect

const UNIQUE_KEY = 'tymlyTest_findByUniqueKey_1_0'
const COMPOSITE_KEY = 'tymlyTest_findByCompositeKey_1_0'

describe('FindById State Resource', function () {
  this.timeout(process.env.TIMEOUT || 5000)
  let tymlyService, statebox

  before('boot tymly', done => {
    tymly.boot(
      {
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/find-by-id-blueprint')
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

  it('find by composite key', async () => {
    const executionDescription = await statebox.startExecution(
      { name: 'Billy', animal: 'Dog' },
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

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
