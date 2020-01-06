/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('./../lib')
const path = require('path')
const fs = require('fs')

describe('Version tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService, statebox, originalVersion

  it('boot Tymly', done => {
    tymly.boot(
      {
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/cats-blueprint')
        ],
        pluginPaths: [
          path.resolve(__dirname, './fixtures/plugins/cats-plugin')
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

  it('should get the version from the state resource', async () => {
    const execDesc = await statebox.startExecution({}, 'tymly_getVersions_1_0' , { sendResponse: 'COMPLETE' })
    originalVersion = execDesc.ctx.versionShasum
  })

  it('simulate updating version of components', async () => {
    updateComponentVersions('2.0')
  })

  it('reboot Tymly', done => {
    tymly.boot(
      {
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/cats-blueprint')
        ],
        pluginPaths: [
          path.resolve(__dirname, './fixtures/plugins/cats-plugin')
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

  it('check the version has changed', async () => {
    const execDesc = await statebox.startExecution({}, 'tymly_getVersions_1_0' , { sendResponse: 'COMPLETE' })
    expect(execDesc.ctx.versionShasum).to.not.eql(originalVersion)
  })

  it('revert version of components', async () => {
    updateComponentVersions('1.0')
  })

  it('reboot Tymly again', done => {
    tymly.boot(
      {
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/blueprints/cats-blueprint')
        ],
        pluginPaths: [
          path.resolve(__dirname, './fixtures/plugins/cats-plugin')
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

  it('check the version is same as original', async () => {
    const execDesc = await statebox.startExecution({}, 'tymly_getVersions_1_0' , { sendResponse: 'COMPLETE' })
    expect(execDesc.ctx.versionShasum).to.eql(originalVersion)
  })

  it('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})

function updateComponentVersions (version) {
  const paths = [
    path.resolve(__dirname, './fixtures/blueprints/cats-blueprint/blueprint.json'),
    path.resolve(__dirname, './fixtures/plugins/cats-plugin/plugin.json')
  ]

  for (const _path of paths) {
    const json = require(_path)
    json.version = version
    fs.writeFileSync(_path, JSON.stringify(json, null, 2))
  }
}
