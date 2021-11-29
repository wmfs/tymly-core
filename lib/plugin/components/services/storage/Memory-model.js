'use strict'

// const debug = require('debug')('tymly')
const { v1: uuid } = require('uuid')
const _ = require('lodash')

require('underscore-query')(_)

const NotSet = 'NotSet'

function callbackify (promise, callback) {
  promise
    .then(result => callback(null, result))
    .catch(err => callback(err))
}

const CREATED_BY = 'createdBy'
const MODIFIED_BY = 'modifiedBy'

// TODO: This could be a useful module in its own right?
class MemoryModel {
  constructor (modelDefinition, service) {
    this.name = modelDefinition.name
    this.namespace = modelDefinition.namespace

    this.modelId = modelDefinition.id
    this.data = []
    this.primaryKeyProvided = Array.isArray(modelDefinition.primaryKey)
    this.properties = modelDefinition.properties

    if (this.primaryKeyProvided) {
      this.primaryKey = modelDefinition.primaryKey
    } else {
      this.primaryKey = ['id']
    }

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

    if (Object.prototype.hasOwnProperty.call(options, 'fields') && options.fields.length) {
      docs = docs.map(doc => {
        const transformed = {}
        options.fields.forEach(field => { transformed[field] = doc[field] })
        return transformed
      })
    }

    return docs
  }

  applyWhere (options) {
    if (Object.prototype.hasOwnProperty.call(options, 'where')) {
      const filtered = this.data
        .map(row => {
          const conditions = Object.entries(options.where)
          const matches = conditions
            .map(([propertyId, condition]) => {
              const conditionType = Object.keys(condition)[0]
              const expression = Object.values(condition)[0]

              return evaluateExpression(row[propertyId], conditionType, expression)
            })
            .filter(match => match)
            .length === conditions.length

          return matches ? row : null
        })
        .filter(row => row)

      return this.applyModifiers(filtered, options)
    } else {
      return this.applyModifiers(this.data, options)
    }
  }

  async search (options = {}, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.search(options), callback)
    }

    const page = options.page || 1
    const limit = options.limit || 10
    const offset = Number.isInteger(options.offset)
      ? options.offset
      : (page - 1) * limit

    const where = options.where || {}

    const filters = {
      where,
      offset,
      limit,
      fields: options.fields || [],
      orderBy: options.orderBy || []
    }

    const totalHits = await this.findCount({ where })
    const results = await this.find(filters)

    const totalPages = Math.ceil(totalHits / limit)

    return {
      page,
      totalPages,
      results,
      totalHits
    }
  }

  async find (options, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.find(options), callback)
    }
    return this.applyWhere(options).map(_.cloneDeep)
  }

  turnIdIntoWhere (id) {
    const where = {}
    this.primaryKey.forEach((propertyId, index) => {
      where[propertyId] = { equals: id[index] }
    })
    return where
  }

  turnIdIntoProperties (id) {
    const properties = {}
    this.primaryKey.forEach((propertyId, index) => {
      properties[propertyId] = id[index]
    })
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

  async findCount (options = {}, callback = NotSet) {
    if (callback !== NotSet) {
      return callbackify(this.findCount(options), callback)
    }

    return this.applyWhere(options).length
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
    let index = 0

    for (const row of this.data) {
      let matches = true

      Object.entries(whereProperties)
        .forEach(([propertyId, value]) => {
          matches = matches && (value === row[propertyId])
        })

      if (matches) {
        return index
      }

      ++index
    }

    return -1
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

function evaluateExpression (value, conditionType, expression) {
  switch (conditionType) {
    case 'equals':
      if (Array.isArray(expression)) {
        if (!expression.includes(value)) {
          return false
        }
      } else {
        if (value !== expression) {
          return false
        }
      }
      break
    case 'moreThan':
      if (!(value > expression)) {
        return false
      }
      break
    case 'lessThan':
      if (!(value < expression)) {
        return false
      }
      break
    case 'moreThanEquals':
      if (!(value >= expression)) {
        return false
      }
      break
    case 'lessThanEquals':
      if (!(value <= expression)) {
        return false
      }
      break
    case 'like':
      if (!(value.includes(expression))) {
        return false
      }
      break
  }
  return true
}

module.exports = MemoryModel
