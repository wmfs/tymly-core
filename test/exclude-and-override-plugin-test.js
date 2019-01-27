/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('./../lib')
const path = require('path')

describe('Exclude plugins tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyServices, statebox

  it('should boot Tymly and see all plugins', done => {
    tymly.boot(
      {
        pluginPaths: path.resolve(__dirname, './fixtures/plugins/*-plugin')
      },
      (err, ts) => {
        expect(err).to.eql(null)
        tymlyServices = ts
        statebox = ts.tymly.bootedServices.statebox
        done()
      }
    )
  })

  it('Test we\'ve got the thing-that-should-not-be version of the Hello state resource', async () => {
    // Prove earlier state-resources from it-lives-plugin are overridden.
    const Hello = statebox = statebox.statebox.findModuleByName('hello')
    const hello = new Hello()
    const event = {}
    const context = {
      sendTaskSuccess: function () {}
    }
    hello.run(event, context)
    expect(event.greeting).to.eql('HELLO, I SHOULD NOT BE...')
  })

  it('First Tymly shutdown', async () => {
    await tymlyServices.tymly.shutdown()
  })

  it('should boot Tymly, but excluding the-thing-that-should-not-be plugin', done => {
    tymly.boot(
      {
        pluginPaths: path.resolve(__dirname, './fixtures/plugins/*-plugin'),
        excludePlugins: 'the-thing-that-should-not-be-plugin',
        excludeBlueprints: 'the-thing-that-should-not-be-blueprint'
      },
      (err, ts) => {
        expect(err).to.eql(null)
        tymlyServices = ts
        statebox = ts.tymly.bootedServices.statebox
        done()
      }
    )
  })

  it('Test we\'ve got the it-lives version of the Hello state resource, because of exclusion', async () => {
    const Hello = statebox = statebox.statebox.findModuleByName('hello')
    const hello = new Hello()
    const event = {}
    const context = {
      sendTaskSuccess: function () {}
    }
    hello.run(event, context)
    expect(event.greeting).to.eql('HELLO...')
  })

  it('Second Tymly shutdown', async () => {
    await tymlyServices.tymly.shutdown()
  })
})
