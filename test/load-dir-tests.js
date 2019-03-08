/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const path = require('path')

const loadDir = require('../lib/boot/load/tymly-loader/load-dir')

describe('loadDir loader test', () => {
  const testDir = path.resolve(
    __dirname,
    './fixtures/loader/cats-blueprint'
  )

  it('load blueprint dir', () => {
    const components = { }

    loadDir(
      testDir,
      components,
      {
        quiet: true,
        expectModule: false,
        expectedMetaFilename: 'blueprint.json',
        mandatoryMetaKeys: ['name', 'version', 'namespace'],
      }
    )

    expect(components.categories).to.not.be.null()
    expect(components.registryKeys).to.not.be.null()
    expect(components.stateMachines).to.not.be.null()
    expect(components.templateRoles).to.not.be.null()
  })
})
