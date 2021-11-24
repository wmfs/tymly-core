const FindStateResourceBase = require('../finding/find-base')

class FindingCount extends FindStateResourceBase {
  constructor () {
    super('FindingCount', 'findCount')
  }
}

module.exports = FindingCount
