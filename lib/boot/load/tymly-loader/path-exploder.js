const _ = require('lodash')
const { globSync } = require('glob')
const path = require('upath')

module.exports = function pathExploder (sourcePaths, options) {
  const expectModule = (_.isBoolean(options.expectModule)) ? options.expectModule : false

  // And explode...
  // * Split on ; and glob off
  // -------------------------
  const explodedDirs = []
  for (const sourcePath of sourcePaths) {
    const parts = sourcePath.split(';').map(p => p.trim()).filter(p => p.length)
    for (const rawPart of parts) {
      const part = path.normalize(rawPart)
      const globbed = globSync(part)

      if (globbed.length === 0) {
        options.messages.warning(`The directory at path ${rawPart} yielded no content `)
      }

      globbed.sort()

      for (let dir of globbed) {
        if (Array.isArray(options.excludeBaseNames) && options.excludeBaseNames.indexOf(path.basename(dir)) !== -1) {
          options.messages.info(`[[Excluded]] ${dir}`)
        } else {
          if (expectModule) {
            dir = require.resolve(dir)
          }
          if (path.basename(dir) === 'index.js') {
            dir = path.dirname(dir)
          }

          if (Object.prototype.hasOwnProperty.call(options, 'suffix') && _.isString(options.suffix)) {
            dir = path.join(dir, options.suffix)
          }

          explodedDirs.push(dir)
        }
      }
    }
  }

  return explodedDirs
}
