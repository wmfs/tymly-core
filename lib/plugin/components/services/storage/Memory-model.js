'use strict'

// const debug = require('debug')('tymly')
const { v1: uuid } = require('uuid')
const _ = require('lodash')

require('underscore-query')(_)

const NotSet = 'NetSet'

function callbackify (promise, callback) {
  promise
    .then(result => callback(null, result))
    .catch(err => callback(err))
}

function promised (obj, fn, ...args) {
  return new Promise((resolve, reject) => {
    fn.call(obj, ...args, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
} // promised

const CREATED_BY = 'createdBy'
const MODIFIED_BY = 'modifiedBy'

// TODO: This could be a useful module in its own right?
class MemoryModel {
  constructor (modelDefinition, service) {
    this.name = modelDefinition.name
    this.namespace = modelDefinition.namespace

    this.modelId = modelDefinition.id
    this.data = []
    this.primaryKeyProvided = _.isArray(modelDefinition.primaryKey)
    this.properties = modelDefinition.properties

    if (this.primaryKeyProvided) {
      this.primaryKey = modelDefinition.primaryKey
    } else {
      this.primaryKey = ['id']
    }

    this.promised = (...args) => promised(this, ...args)
    this.currentUser = (service && service.currentUser) ? () => service.currentUser() : () => null
  }

  extractIdPropertiesFromDoc (doc) {
    const properties = {}
    this.primaryKey.forEach(
      function (propertyId) {
        properties[propertyId] = doc[propertyId]
      }
    )

    return properties
  }

  async create (jsonData, options, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.create(jsonData, options), callback)
    }

    jsonData = Array.isArray(jsonData) ? jsonData : [jsonData]

    return jsonData.map(jd => this.createOne(jd))[0]
  }

  createOne (doc) {
    const whereProperties = this.extractIdPropertiesFromDoc(doc)
    const index = this.findFirstIndex(whereProperties)

    if (index === -1) {
      const copy = _.cloneDeep(doc)
      if (!this.primaryKeyProvided) {
        copy.id = uuid()
      }
      //        copy.created = now
      //        copy.updated = now
      copy[CREATED_BY] = this.currentUser()
      this.data.push(copy)

      return {
        idProperties: this.extractIdPropertiesFromDoc(copy)
      }
    } else {
      throw new MemoryModelError(
        'DuplicatePrimaryKey',
        `Unable to create model '${this.modelId}' because ${JSON.stringify(whereProperties)} already exists`
      )
    }
  }

  applyModifiers (docs, options) {
    if (Object.prototype.hasOwnProperty.call(options, 'orderBy')) {
      docs = _.sortBy(docs, options.orderBy)
    }

    if (Object.prototype.hasOwnProperty.call(options, 'offset')) {
      docs = docs.slice(options.offset)
    }

    if (Object.prototype.hasOwnProperty.call(options, 'limit')) {
      docs = docs.slice(0, options.limit)
    }

    return docs
  }

  applyWhere (options) {
    const _this = this
    if (Object.prototype.hasOwnProperty.call(options, 'where')) {
      const filtered = []

      this.data.forEach(
        function (row) {
          let matches = true

          _.forOwn(
            options.where,
            function (condition, propertyId) {
              const conditionType = _.keys(condition)[0]
              const expression = _.values(condition)[0]

              switch (conditionType) {
                case 'equals':
                  if (Array.isArray(expression)) {
                    if (!expression.includes(row[propertyId])) {
                      matches = false
                    }
                  } else {
                    if (row[propertyId] !== expression) {
                      matches = false
                    }
                  }
                  break
                case 'moreThan':
                  if (!(row[propertyId] > expression)) {
                    matches = false
                  }
                  break
                case 'lessThan':
                  if (!(row[propertyId] < expression)) {
                    matches = false
                  }
                  break
                case 'moreThanEquals':
                  if (!(row[propertyId] >= expression)) {
                    matches = false
                  }
                  break
                case 'lessThanEquals':
                  if (!(row[propertyId] <= expression)) {
                    matches = false
                  }
                  break
                case 'like':
                  if (!(row[propertyId].includes(expression))) {
                    matches = false
                  }
                  break
              }
            }
          )

          if (matches) {
            filtered.push(row)
          }
        }
      )
      return _this.applyModifiers(filtered, options)
    } else {
      return _this.applyModifiers(this.data, options)
    }
  }

  // TODO: Options! limit/offset etc.
  async find (options, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.find(options), callback)
    }
    return this.applyWhere(options).map(_.cloneDeep)
  }

  turnIdIntoWhere (id) {
    const where = {}
    let i = -1
    this.primaryKey.forEach(
      function (propertyId) {
        i++
        where[propertyId] = { equals: id[i] }
      }
    )
    return where
  }

  turnIdIntoProperties (id) {
    const properties = {}
    let i = -1
    this.primaryKey.forEach(
      function (propertyId) {
        i++
        properties[propertyId] = id[i]
      }
    )
    return properties
  }

  findById (id, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.findById(id), callback)
    }
    if (!Array.isArray(id)) {
      id = [id]
    }

    return this.findOne({
      where: this.turnIdIntoWhere(id)
    })
  }

  async findOne (options, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.findOne(options), callback)
    }

    const output = this.applyWhere(options)
    if (output.length > 0) {
      return _.cloneDeep(output[0])
    }
  }

  findFirstIndex (whereProperties) {
    let index = -1

    let i = -1
    this.data.forEach(
      function (row) {
        i++

        if (index === -1) {
          let matches = true

          _.forOwn(
            whereProperties,
            function (value, propertyId) {
              if (value !== row[propertyId]) {
                matches = false
              }
            }
          )

          if (matches) {
            index = i
          }
        }
      }
    )
    return index
  }

  async update (doc, options, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.update(doc, options), callback)
    }

    if (options.setMissingPropertiesToNull === false) {
      return this.patch(doc, options)
    }

    const where = this.extractIdPropertiesFromDoc(doc)
    const index = this.findFirstIndex(where)
    if (index !== -1) {
      const update = _.cloneDeep(doc)
      update[MODIFIED_BY] = this.currentUser()
      this.data[index] = update
    }
  }

  async patch (doc, options, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.patch(doc, options), callback)
    }

    const where = this.extractIdPropertiesFromDoc(doc)
    const index = this.findFirstIndex(where)
    if (index !== -1) {
      for (const [k, v] of Object.entries(doc)) {
        this.data[index][k] = v
      }
      this.data[index][MODIFIED_BY] = this.currentUser()
    }
  }

  async upsert (doc, options, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.upsert(doc, options), callback)
    }

    const whereProperties = this.extractIdPropertiesFromDoc(doc)
    const index = this.findFirstIndex(whereProperties)

    if (index !== -1) {
      if (options.setMissingPropertiesToNull === false) {
        return this.patch(doc, options, callback)
      }

      this.data[index] = _.cloneDeep(doc)
    } else {
      return this.create(doc, options)
    }
  }

  async destroyById (id, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.destroyById(id), callback)
    }

    if (!Array.isArray(id)) {
      id = [id]
    }

    const properties = this.turnIdIntoProperties(id)
    const index = this.findFirstIndex(properties)

    if (index !== -1) {
      this.data.splice(index, 1)
    }

    return 0
  }
}

class MemoryModelError extends Error {
  constructor (name, message) {
    super(message)
    this.name = name
  }
}

module.exports = MemoryModel
