/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const path = require('path')

const jsonLoader = require('../lib/boot/load/tymly-loader/file-loaders/json')

describe('JSON loader tests', () => {
  const testDir = path.resolve(__dirname, './fixtures/loader')

  const blueprintMeta = {
    namespace: 'test',
    name: 'loadTest',
    version: '1.0'
  }

  it('normal json file', () => {
    const info = jsonLoader(
      blueprintMeta,
      'normal',
      path.resolve(testDir, 'plain.json')
    )

    expect(info.key).to.eql('test_normal')
    expect(info.content).to.eql({
      namespace: 'test',
      blueprintName: 'loadTest',
      blueprintVersion: '1.0',
      id: 'normal',
      name: 'normal',
      value: 'string',
      array: [1, 2, 3],
      obj: {
        a: 'one',
        b: 'two'
      }
    })
    expect(info.refs).to.eql(null)
  })

  it('json file with a tymlyRef', () => {
    const info = jsonLoader(
      blueprintMeta,
      'withref',
      path.resolve(testDir, 'withref.json')
    )

    expect(info.key).to.eql('test_withref')
    expect(info.content).to.eql({
      namespace: 'test',
      blueprintName: 'loadTest',
      blueprintVersion: '1.0',
      id: 'withref',
      name: 'withref',
      value: 'string',
      array: [1, 2, 3],
      obj: {
        $tymlyRef: 'file://somefile.json'
      }
    })
    expect(info.refs).to.eql([{
      path: '$.obj',
      ref: 'file://somefile.json'
    }])
  })

  it('json file with malformed tymlyRef', () => {
    let message = null

    const info = jsonLoader(
      blueprintMeta,
      'withref',
      path.resolve(testDir, 'with-malformed-ref.json'),
      {
        error: msg => { message = msg }
      }
    )

    expect(info).to.eql(undefined)
    expect(message.name).to.eql('jsonFileLoadFail')
    expect(message.body).to.not.be.null()
    expect(message.body.message).to.eql('Malformed tymlyRef at $.obj')
  })
})
