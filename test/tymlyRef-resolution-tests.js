/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const expect = require('chai').expect

describe('TymlyRef resolution', () => {
  it('pre-boot reference resolution', async () => {
    const tymlyServices = await tymly.boot({
      pluginPaths: [
        path.resolve(__dirname, 'fixtures/plugins/with-ref-plugin')
      ]
    })

    const files = tymlyServices.probe.files

    expect(Object.keys(files).length).to.eql(2)
    expect(files.refResolution_inner).to.eql({
      blueprintName: 'withRef',
      blueprintVersion: '1.0',
      namespace: 'refResolution',
      id: 'inner',
      name: 'inner'
    })
    expect(files.refResolution_outer).to.eql({
      blueprintName: 'withRef',
      blueprintVersion: '1.0',
      namespace: 'refResolution',
      id: 'outer',
      name: 'outer',
      description: 'a file which has a tymly ref to another file',
      contents: {
        blueprintName: 'withRef',
        blueprintVersion: '1.0',
        namespace: 'refResolution',
        id: 'inner',
        name: 'inner'
      }
    })
  })
})
