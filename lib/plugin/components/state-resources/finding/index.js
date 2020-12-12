const FindStateResourceBase = require('./find-base')

class Finding extends FindStateResourceBase {
  constructor () {
    super('Finding', 'find')
  }
}

module.exports = Finding
