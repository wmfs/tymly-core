const dottie = require('dottie')

module.exports = class ConfigSetting {
  init (resourceConfig, env) {
    this.setting = dottie.get(
      env.config,
      resourceConfig.setting
    )
  }

  run (event, context) {
    context.sendTaskSuccess(this.setting)
  } // run
} // ConfigSetting
