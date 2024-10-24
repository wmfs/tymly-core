/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const fs = require('fs')
const expect = require('chai').expect
const _ = require('lodash')

const AvailableResources = require('./../lib/plugin/components/state-resources/available-resources')
const AvailableStateMachines = require('./../lib/plugin/components/state-resources/available-state-machines')

describe('list available state machines', () => {
  let tymlyService
  let statebox

  before('boot tymly', async () => {
    const tymlyServices = await tymly.boot({
      blueprintPaths: [
        path.resolve(__dirname, './fixtures/blueprints/timestamp-blueprint')
      ],
      pluginPaths: [
      ]
    })

    tymlyService = tymlyServices.tymly
    statebox = tymlyServices.statebox
  })

  it('available-resources state resource', async () => {
    const resources = await runAvailableResources()

    const stateResourceDir = path.resolve(__dirname, './../lib/plugin/components/state-resources')
    const stateResources = fs.readdirSync(stateResourceDir)
      .filter(name => fs.lstatSync(path.resolve(__dirname, './../lib/plugin/components/state-resources', name)).isDirectory())
      .map(name => _.camelCase(name))

    expect(resources).to.eql(stateResources)
  })

  it('available-state-machines state resource', async () => {
    const stateMachines = await runAvailableStateMachines()

    expect(stateMachines[0].name).to.eql('tymlyTest_timestampNow_1_0')
    expect(stateMachines[0].description).to.eql('Blueprint to get timestamp')
  })

  after('shutdown tymly', async () => {
    await tymlyService.shutdown()
  })

  function runAvailableResources () {
    return runStateResource(AvailableResources)
  } // runAvailableResources

  function runAvailableStateMachines () {
    return runStateResource(AvailableStateMachines)
  } // runAvailableStateMachines

  async function runStateResource (ResourceClass) {
    const stateResource = new ResourceClass()
    stateResource.init(
      null,
      {
        bootedServices: {
          statebox
        }
      }
    )

    return new Promise((resolve, reject) => {
      stateResource.run(
        null,
        {
          sendTaskSuccess: s => resolve(s),
          sendTaskFailure: f => reject(f)
        }
      )
    })
  } // runStateResource
})
