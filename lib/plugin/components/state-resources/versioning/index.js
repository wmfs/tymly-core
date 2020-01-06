const shasum = require('shasum')

module.exports = class Versioning {
  init (resourceConfig, env, callback) {
    this.versions = {
      blueprints: {},
      plugins: {}
    }

    if (env.blueprintComponents.blueprintJson) {
      for (const [key, val] of Object.entries(env.blueprintComponents.blueprintJson)) {
        this.versions.blueprints[key] = JSON.parse(val.content).version
      }
    }

    if (env.pluginComponents.pluginJson) {
      for (const [key, val] of Object.entries(env.pluginComponents.pluginJson)) {
        this.versions.plugins[key] = JSON.parse(val.content).version
      }
    }

    callback(null)
  }

  run (event, context) {
    context.sendTaskSuccess({ versionShasum: shasum(this.versions) })
  }
}
