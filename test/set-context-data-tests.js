/* eslint-env mocha */

const path = require('path')
const expect = require('chai').expect
const moment = require('moment')
const tymly = require('./../lib')

const STATE_MACHINE_NAME = 'tymlyTest_setContextData_1_0'

describe('Context tests', function () {
  let tymlyService, statebox
  this.timeout(process.env.TIMEOUT || 5000)

  it('load the animal blueprint (which uses of the set-context-data state resource)', function (done) {
    tymly.boot(
      {
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/context-blueprint')
        ],
        pluginPaths: [
          path.resolve(__dirname, './fixtures/plugins/dummy-user-info-plugin')
        ]
      },
      function (err, tymlyServices) {
        tymlyService = tymlyServices.tymly
        statebox = tymlyServices.statebox
        expect(err).to.eql(null)
        done()
      }
    )
  })

  it('should execute the set-context-data state machine', async () => {
    const execDesc = await statebox.startExecution(
      {
        isThisNull: 'nope',
        dog: 'Donald',
        faveColours: ['pink', 'blue'],
        height: 3,
        weight: 5
      },
      STATE_MACHINE_NAME,
      {
        sendResponse: 'COMPLETE',
        userId: 'auth0|5a157ade1932044615a1c502'
      }
    )

    expect(execDesc.currentStateName).to.eql('SetDefaults')
    expect(execDesc.currentResource).to.eql('module:setContextData')
    expect(execDesc.stateMachineName).to.eql('tymlyTest_setContextData_1_0')
    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.ctx.formData.isThisNull).to.eql(null)
    expect(execDesc.ctx.formData.catName).to.eql('Rupert')
    expect(execDesc.ctx.formData.dogName).to.eql('Donald')
    expect(execDesc.ctx.formData.faveColours).to.eql(['pink', 'blue'])
    expect(execDesc.ctx.formData.measurements[0].height).to.eql(3)
    expect(execDesc.ctx.formData.measurements[0].weight).to.eql(5)
    expect(execDesc.ctx.formData.measurements.length).to.eql(1)
    expect(execDesc.ctx.formData.catOwnerId).to.eql('auth0|5a157ade1932044615a1c502')
    expect(execDesc.ctx.formData.email).to.eql('tymly@xyz.com')
    expect(moment(execDesc.ctx.formData.catBirthday, moment.ISO_8601, true).isValid()).to.eql(true)
  })

  it('should shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
