/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const tymly = require('./../lib')
const fs = require('fs')

describe('Temp service', function () {
  let tymlyService
  let tempService

  before('startup', async () => {
    const services = await tymly.boot({})

    tymlyService = services.tymly
    tempService = services.temp
  })

  describe('create temp directory', () => {
    it('promises', async () => {
      const dir = await tempService.makeTempDir('fruit')

      confirmDirectory(dir)
    })

    it('callback', () => {
      tempService.makeTempDir(
        'bubbles',
        (dir, err) => {
          expect(err).to.be.null()
          confirmDirectory(dir)
        }
      )
    })
  })

  describe('can not create temp directory - bad path', () => {
    const badPath = '../../../../../../../../../../bonk'
    it('promises', async () => {
      try {
        await tempService.makeTempDir(badPath)
      } catch (err) {
        return
      }

      expect.fail('makeTempDir should throw with bad path')
    })

    it('callback', done => {
      tempService.makeTempDir(
        badPath,
        done
      )
    })
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
