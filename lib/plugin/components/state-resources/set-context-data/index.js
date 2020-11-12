'use strict'

const _ = require('lodash')
const dottie = require('dottie')
const jp = require('jsonpath')

module.exports = class SetContextData {
  init (resourceConfig, env) {
    this.resourceConfig = resourceConfig
    this.userInfoService = env.bootedServices.userInfo
  }

  async run (event, context) {
    this.email = this.userInfoService ? await this.userInfoService.emailFromUserId(context.userId) : ''

    const FORM_DATA_STRING_LENGTH = 8
    const config = {}
    const data = {}

    for (const key of Object.keys(this.resourceConfig)) {
      let theKey

      if (_.isString(key) && key.length > 0) {
        let dottiePath = key

        if (dottiePath[0] === '$') {
          dottiePath = dottiePath.slice(1)
        }

        if (dottiePath[0] === '.') {
          dottiePath = dottiePath.slice(1)
          theKey = dottiePath
        }

        if (dottiePath.substring(0, FORM_DATA_STRING_LENGTH) === 'formData') {
          dottiePath = dottiePath.slice(FORM_DATA_STRING_LENGTH + 1)
        }
      }

      config[key] = this.getValue(event, context, key, this.resourceConfig[key])
      dottie.set(data, theKey, config[key])
    }

    context.sendTaskSuccess(data)
  }

  getValue (event, context, key, config, val) {
    let value = val || config

    if (_.isString(config) && config.substring(0, 2) === '$.') {
      value = jp.value(event, config)
    } else if (config === '$NOW') {
      value = new Date().toISOString()
    } else if (config === '$USERID') {
      value = context.userId
    } else if (config === '$EMAIL') {
      value = this.email
    } else if (_.isArray(config)) {
      value = config.map(c => {
        return this.getValue(event, context, key, c, value)
      })
    } else if (_.isPlainObject(config)) {
      value = {}
      Object.keys(config).forEach(c => {
        value[c] = this.getValue(event, context, key, config[c])
      })
    }

    return value
  }
}
