const path = require('path')
const fs = require('fs')
const pathExploder = require('./tymly-loader/path-exploder')

module.exports = function discoverBlueprintDirs (rawPaths, messages) {
  const pluginPaths = pathExploder(rawPaths, { expectModule: true, messages: messages })

  if (!Array.isArray(pluginPaths)) {
    return []
  }

  const pluginBlueprintDirs = []

  for (const pluginPath of pluginPaths) {
    const blueprintsDir = path.join(pluginPath, 'blueprints')
    try {
      const stats = fs.lstatSync(blueprintsDir)
      if (stats.isDirectory()) {
        const subDirs = fs.readdirSync(blueprintsDir)
          .map(subDir => path.join(blueprintsDir, subDir))
          .filter(subDir => fs.statSync(subDir).isDirectory())

        pluginBlueprintDirs.push(...subDirs)
      }
    } catch (err) {
      // ignore as blueprint dirs are not mandatory
    }
  }

  return pluginBlueprintDirs
} // discoverBlueprintDirs
