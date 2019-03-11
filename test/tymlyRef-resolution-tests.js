/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const expect = require('chai').expect

describe('TymlyRef resolution', () => {
  const probePluginPath = path.resolve(__dirname, 'fixtures/plugins/with-ref-plugin')
  const bpDir = path.resolve(__dirname, 'fixtures/blueprints')

  const inner = {
    blueprintName: 'withRef',
    blueprintVersion: '1.0',
    namespace: 'refResolution',
    id: 'inner',
    name: 'inner'
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
      'good reference',
      'with-good-ref-blueprint',
      inner
    ],
    [
      'good reference in an array',
      'with-good-ref-in-array-blueprint',
      [
        'some stuff before',
        inner,
        'some stuff afterwards'
      ]
    ],
    [
      'reference the same file twice',
      'with-two-good-refs-blueprint',
      {
        once: inner,
        again: inner
      }
    ],
    [
      'nested ref',
      'with-refs-in-refs-blueprint',
      between
    ],
    [
      'multiple nested ref',
      'with-multiple-refs-in-refs-blueprint',
      [
        between,
        {
          blueprintName: 'withRef',
          blueprintVersion: '1.0',
          namespace: 'refResolution',
          id: 'shim',
          name: 'shim',
          contents: between
        }
      ]
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
      'bad reference name',
      'with-bad-ref-name-blueprint',
      'Error: Could not resolve \'files:refResolution_inner\' in refResolution_outer'
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
          expect(err.message).to.eql(error)
        }
      }) // it ...
    } // for ...
  }) // describe
})
