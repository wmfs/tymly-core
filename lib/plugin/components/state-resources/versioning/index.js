const shasum = require('shasum')

module.exports = class Versioning {
  init (resourceConfig, env, callback) {
    this.versions = {}

    for (const [key, val] of Object.entries(env.blueprintComponents.blueprintJson)) {
      this.versions[key] = JSON.parse(val.content).version
    }

    // todo: collect version of plugins?

    callback(null)
  }

  run (event, context) {
    context.sendTaskSuccess({ versionShasum: shasum(this.versions) })
  }
}
