/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const tymly = require('./../lib')
const fs = require('fs')
const os = require('os')

describe('Temp service', function () {
  let tymlyService
  let tempService

  before('startup', async () => {
    const services = await tymly.boot({})

    tymlyService = services.tymly
    tempService = services.temp
  })

  it('create temp directory', async () => {
    const dir = await tempService.makeTempDir('fruit')
    confirmDirectory(dir)
  })

  it('can not create temp directory - bad path', async () => {
    const badPath = os.platform() === 'win32'
      ? ':::'
      : '../../../../../../../../../../bonk'
    try {
      await tempService.makeTempDir(badPath)
    } catch (err) {
      return
    }
    expect.fail('makeTempDir should throw with bad path')
  })

  after('shutdown', async () => {
    await tymlyService.shutdown()
  })
})

function confirmDirectory (dir) {
  const stats = fs.statSync(dir)
  expect(stats.isDirectory()).to.be.true()
  fs.rmdirSync(dir)
}
