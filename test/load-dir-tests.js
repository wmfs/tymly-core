/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const path = require('path')

const loadDir = require('../lib/boot/load/tymly-loader/load-dir')

describe('loadDir loader test', () => {
  const testDir = path.resolve(
    __dirname,
    './fixtures/loader'
  )

  it('load a plain blueprint dir', () => {
    const components = { }
    const tymlyRefs = { }

    loadDir(
      path.resolve(testDir, 'cats-blueprint'),
      components,
      tymlyRefs,
      {
        quiet: true,
        expectModule: false,
        expectedMetaFilename: 'blueprint.json',
        mandatoryMetaKeys: ['name', 'version', 'namespace']
      }
    )

    expect(components.categories).to.not.be.null()
    expect(components.registryKeys).to.not.be.null()
    expect(components.stateMachines).to.not.be.null()
    expect(components.templateRoles).to.not.be.null()
    expect(tymlyRefs).to.eql({})
  })

  it('load a blueprint with refs', () => {
    const components = { }
    const tymlyRefs = { }

    loadDir(
      path.resolve(testDir, 'cats-blueprint-with-ref'),
      components,
      tymlyRefs,
      {
        quiet: true,
        expectModule: false,
        expectedMetaFilename: 'blueprint.json',
        mandatoryMetaKeys: ['name', 'version', 'namespace']
      }
    )

    expect(components.categories).to.not.be.null()
    expect(components.registryKeys).to.not.be.null()
    expect(components.stateMachines).to.not.be.null()
    expect(components.templateRoles).to.not.be.null()
    expect(tymlyRefs).to.eql({
      stateMachines: {
        tymlyTest_aDayInTheLife: [{
          path: '$.States.Sitting',
          ref: 'task://sitting'
        }]
      }
    })
  })
})
