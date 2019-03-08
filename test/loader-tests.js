/* eslint-env mocha */

const expect = require('chai').expect
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
      array: [ 1, 2, 3 ],
      obj: {
        a: 'one',
        b: 'two'
      }
    })
  })
})
