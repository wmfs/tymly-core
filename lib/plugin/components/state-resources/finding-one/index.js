const FindStateResourceBase = require('../finding/find-base')

class FindingOne extends FindStateResourceBase {
  constructor () {
    super('FindingOne', 'findOne')
  }
}

module.exports = FindingOne
