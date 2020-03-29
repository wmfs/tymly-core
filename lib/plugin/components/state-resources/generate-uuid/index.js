'use strict'

const { v1: uuid } = require('uuid')
const { customAlphabet } = require('nanoid')
const ALPHABET = 'abcdefghijklmnopqrstvwxyzABCDEFGHIJKLMNOPQRSTVWXYZ1234567890'

module.exports = class GenerateUuid {
  init (resourceConfig, env, callback) {
    this.short = resourceConfig.short || false

    const length = resourceConfig.length || 10
    this.nanoid = customAlphabet(ALPHABET, length)
    callback(null)
  }

  run (event, context) {
    const id = this.short ? this.nanoid() : uuid()
    context.sendTaskSuccess({ id })
  }
}
