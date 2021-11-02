const glob = require('glob')
const fs = require('fs')
const path = require('path')

const explodePaths = (result, paths) => {
  return new Promise((resolve, reject) => {
    glob(paths, (err, files) => {
      if (err) return reject(err)
      result.push(...files)
      resolve()
    })
  })
}

module.exports = class Version {
  async init (resourceConfig, env) {
    this.versions = []

    const paths = []

    await Promise.all(env.pluginPaths.map(p => explodePaths(paths, p)))
    await Promise.all(env.blueprintPaths.map(p => explodePaths(paths, p)))

    for (const p of paths) {
      const components = fs.readdirSync(p)

      let fileType

      if (components.includes('plugin.json')) fileType = 'plugin.json'
      if (components.includes('blueprint.json')) fileType = 'blueprint.json'

      if (components.includes(fileType)) {
        const file = fs.readFileSync(path.join(p, fileType), 'utf-8')
        if (file) {
          const { version } = JSON.parse(file)
          this.versions.push({ name: path.basename(p), version })
        } else {
          // console.log(`Cannot read ${path.join(p, fileType)}`)
        }
      } else {
        // console.log(`Cannot find plugin.json or blueprint.json for ${p}`)
      }
    }
  }

  run (event, context) {
    context.sendTaskSuccess(this.versions)
  } // run
} // Version
