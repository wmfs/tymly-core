const FindStateResourceBase = require('../finding/find-base')

class StorageSearch extends FindStateResourceBase {
  constructor () {
    super('StorageSearch', 'search')
  }
}

module.exports = StorageSearch
