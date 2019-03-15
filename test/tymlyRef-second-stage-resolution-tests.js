/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const chai = require('chai')
chai.use(require('chai-string'))
const expect = chai.expect

describe('TymlyRef second-stage resolution', () => {
  const probePluginPath = path.resolve(__dirname, 'fixtures/plugins/with-function-ref-plugin')
  const bpDir = path.resolve(__dirname, 'fixtures/blueprints')

  const inner = {
    message: 'I came from a function call'
  }
  const between = {
    blueprintName: 'withRef',
    blueprintVersion: '1.0',
    namespace: 'refResolution',
    id: 'between',
    name: 'middle',
    description: 'sits in the middle',
    contents: inner
  }

  const goodTests = [
    [
      'good function reference',
      'with-function-ref-blueprint',
      inner
    ],
    [
      'good function reference in an array',
      'with-function-ref-in-array-blueprint',
      [
        'some stuff before',
        inner,
        'some stuff afterwards'
      ]
    ],
    [
      'function reference the same file twice',
      'with-two-function-refs-blueprint',
      {
        once: inner,
        again: inner
      }
    ],
    [
      'function ref nested in a first-pass ref',
      'with-function-refs-in-refs-blueprint',
      between
    ]
  ]

  describe('Good references', () => {
    for (const [label, bp, contents] of goodTests) {
      it(label, async () => {
        const tymlyServices = await tymly.boot({
          pluginPaths: [ probePluginPath ],
          blueprintPaths: [ path.resolve(bpDir, bp) ]
        })

        const files = tymlyServices.probe.files

        expect(files.refResolution_outer.contents).to.eql(contents)
      })
    }
  })

  const badTests = [
    [
      'bad function reference name',
      'with-bad-function-ref-name-blueprint',
      'Error: Could not resolve function:refResolution_doesNotExist in files:refResolution_outer'
    ],
    [
      'unknown reference type',
      'with-bad-resolution-type-blueprint',
      'Error: Unknown tymlyRef unknownResolver:refResolution_doesNotExist in files:refResolution_outer'
    ]

  ]

  describe('Bad references', () => {
    for (const [label, bp, error] of badTests) {
      it(label, async () => {
        try {
          await tymly.boot({
            blueprintPaths: [ path.resolve(bpDir, bp) ]
          })
        } catch (err) {
          expect(err.message).to.startWith(error)
          return
        }
        expect.fail('Tymly Ref should have failed')
      }) // it ...
    } // for ...
  }) // describe
})
