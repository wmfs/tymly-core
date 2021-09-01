const path = require('path')
const fs = require('fs')
const { camelCase } = require('lodash')

const buildPaths = require('../load/build-paths')
const processExclusions = require('../load/process-exclusions')
const pathExploder = require('../load/tymly-loader/path-exploder')

const COMPONENT_TYPE_IGNORE_LIST = ['test', 'nodeModules', 'shared', 'common']

module.exports = function (options) {
  const mods = {}

  const {
    messages,
    modPaths,
    excludeMods
  } = options

  messages.heading('Loading mods')

  if (!modPaths || !modPaths.length) {
    messages.subHeading('Nothing to load')
    return mods
  }

  const paths = buildPaths(modPaths || [])
  const explodedPaths = pathExploder(
    paths,
    {
      messages,
      excludeBaseNames: processExclusions(excludeMods)
    }
  )

  for (const rootDir of explodedPaths) {
    messages.subHeading(rootDir)

    const metaJson = require(path.join(rootDir, 'mod.json'))
    const { namespace } = metaJson.blueprint

    for (const dir of fs.readdirSync(rootDir)) {
      const dirPath = path.join(rootDir, dir)

      if (fs.statSync(dirPath).isDirectory() && dir[0] !== '.') {
        const dirType = camelCase(dir)

        if (!COMPONENT_TYPE_IGNORE_LIST.includes(dirType)) {
          messages.info(`Loading ${dirType}`)

          if (!mods[dirType]) mods[dirType] = {}

          const dirContent = fs.readdirSync(dirPath)

          for (const filename of dirContent) {
            const key = camelCase(path.parse(filename).name)
            const filepath = path.join(dirPath, filename)
            const stats = fs.statSync(filepath)

            if (stats.isFile()) {
              const ext = path.extname(filepath).slice(1)

              if (ext === 'json') {
                const json = require(filepath)
                const componentKey = [namespace, key, json.version ? json.version.replace('.', '_') : null].filter(k => k).join('_')
                mods[dirType][componentKey] = { type: 'json', mod: json }
              } else {
                if (dirType === 'functions') {
                  const componentKey = [namespace, key].join('_')
                  mods[dirType][componentKey] = { type: 'functions', mod: require(filepath) }
                } else if (dirType === 'images') {
                  const componentKey = [namespace, key].join('_') + `.${ext}`
                  mods[dirType][componentKey] = {
                    type: 'images',
                    mod: {
                      filePath: filepath,
                      filename,
                      namespace,
                      ext: `.${ext}`
                    }
                  }
                } else {
                  options.messages.info(`${dirType} is not a recognised component`)
                }
              }
            } else {
              options.messages.info(`${filepath} is not a file`)
            }
          }
        } else {
          messages.info(`Ignoring ${dirType}`)
        }
      }
    }
  }

  return mods
}
