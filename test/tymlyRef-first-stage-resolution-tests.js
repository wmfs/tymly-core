/* eslint-env mocha */

const tymly = require('./../lib')
const path = require('path')
const chai = require('chai')
chai.use(require('chai-string'))
const expect = chai.expect

describe('TymlyRef first-stage resolution', () => {
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
    ],
    [
      'wildcard namespace reference',
      'with-wildcard-namespace-ref-blueprint',
      [inner]
    ],
    [
      'wildcard name reference',
      'with-wildcard-name-ref-blueprint',
      [inner]
    ],
    [
      'reference with JSONPath selection',
      'with-good-ref-and-jsonpath-blueprint',
      {
        name: 'the subsection'
      }
    ],
    [
      'reference with JSONPath Array selection',
      'with-good-ref-and-jsonpath-array-blueprint',
      [
        {
          name: 'the before subsection'
        },
        {
          name: 'the subsection'
        },
        {
          name: 'the next subsection'
        }
      ]
    ],
    [
      'reference with JSONPath Array subselect',
      'with-good-ref-and-jsonpath-array-subselect-blueprint',
      [
        {
          name: 'the subsection'
        },
        {
          name: 'the next subsection'
        }
      ]
    ]
  ]

  describe('Good references', () => {
    for (const [label, bp, contents] of goodTests) {
      it(label, async () => {
        const tymlyServices = await tymly.boot({
          pluginPaths: [probePluginPath],
          blueprintPaths: [path.resolve(bpDir, bp)]
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
      'Error: Could not resolve files:refResolution_inner in files:refResolution_outer'
    ],
    [
      'circular reference',
      'with-bad-circular-ref-blueprint',
      'Error: Circular dependency in '
    ]

  ]

  describe('Bad references', () => {
    for (const [label, bp, error] of badTests) {
      it(label, async () => {
        try {
          await tymly.boot({
            blueprintPaths: [path.resolve(bpDir, bp)]
          })
          expect.fail('Tymly Ref should have failed')
        } catch (err) {
          expect(err.message).to.startWith(error)
        }
      }) // it ...
    } // for ...
  }) // describe
})
