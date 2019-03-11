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

  const tests = [
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
      'with-two-good-refs-blueprint', {
        once: inner,
        again: inner
      }
    ]
  ]

  for (const [label, bp, contents] of tests) {
    it(label, async () => {
      const tymlyServices = await tymly.boot({
        pluginPaths: [ probePluginPath ],
        blueprintPaths: [ path.resolve(bpDir, bp) ]
      })

      const files = tymlyServices.probe.files

      expect(Object.keys(files).length).to.eql(2)
      expect(files.refResolution_outer.contents).to.eql(contents)
    })
  }

  it('bad reference', async () => {
    try {
      await tymly.boot({
        blueprintPaths: [
          path.resolve(bpDir, 'with-bad-ref-blueprint')
        ]
      })
    } catch (err) {
      expect(err.message).to.eql('Error: Could not resolve \'files:refResolution_inner\' in refResolution_outer')
    }
  })
})
