/* eslint-env mocha */

'use strict'
const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const expect = chai.expect
const MemoryModel = require('../lib/plugin/components/services/storage/Memory-model')
const assert = require('assert')

describe('Memory Model promise tests', function () {
  let planetsModel
  let personModel

  it('should get some model instances', function () {
    planetsModel = new MemoryModel(
      {
        id: 'planets',
        name: 'planets',
        namespace: 'test',
        primaryKey: ['name'],
        properties: {
          name: 'string'
        }
      }
    )
    personModel = new MemoryModel(
      {
        id: 'people',
        name: 'people',
        namespace: 'test',
        primaryKey: ['employeeNo'],
        properties: {
          employeeNo: 'number'
        }
      }
    )
  })

  it('should create a new person', function () {
    return personModel.create(
      {
        employeeNo: 1,
        firstName: 'Homer',
        lastName: 'Simpson',
        age: 39
      },
      {}
    ).then(idProperties =>
      expect(idProperties).to.eql(
        {
          idProperties:
          {
            employeeNo: 1
          }
        }
      )
    )
  })

  it('should create multiple new people', function () {
    return personModel.create(
      [
        {
          employeeNo: 2,
          firstName: 'Maggie',
          lastName: 'Simpson'
        },
        {
          employeeNo: 3,
          firstName: 'Lisa',
          lastName: 'Simpson',
          age: 8
        },
        {
          employeeNo: 4,
          firstName: 'Marge',
          lastName: 'Simpson',
          age: 36
        },
        {
          employeeNo: 5,
          firstName: 'Bart',
          lastName: 'Simpson',
          age: 10
        }
      ]
    )
  })

  it('should fail creating a new person with an already-used primary key', function () {
    return personModel.create(
      {
        employeeNo: 1,
        firstName: 'Ned',
        lastName: 'Flanders',
        age: 60
      },
      {}
    )
      .then(() => assert(false))
      .catch(err =>
        expect(err.name).to.eql('DuplicatePrimaryKey')
      )
  })

  it('should fail creating new people with an already-used primary key', function () {
    return personModel.create(
      [
        {
          employeeNo: 2,
          firstName: 'Maude',
          lastName: 'Flanders'
        }
      ],
      {}
    )
      .then(() => assert(false))
      .catch(err =>
        expect(err.name).to.eql('DuplicatePrimaryKey')
      )
  })

  it('should find a person via primary key', function () {
    return personModel.findById(3)
      .then(doc =>
        expect(doc).to.containSubset(
          {
            employeeNo: 3,
            firstName: 'Lisa',
            lastName: 'Simpson',
            age: 8
          }
        )
      )
  })

  it("should fail finding a person that's not there", function () {
    return personModel.findById(6)
      .then(doc =>
        expect(doc).to.equal(undefined)
      )
  })

  it('count all documents', async () => {
    const doc = await personModel.findCount()
    expect(doc).to.eql(5)
  })

  it('should count Bart by name', async () => {
    const doc = await personModel.findCount(
      {
        where: {
          firstName: { equals: 'Bart' },
          lastName: { equals: 'Simpson' }
        }
      }
    )
    expect(doc).to.eql(1)
  })

  it('should count one Homer by name', async () => {
    const doc = await personModel.findCount(
      {
        where: {
          firstName: { equals: 'Homer' },
          lastName: { equals: 'Simpson' }
        }
      }
    )
    expect(doc).to.eql(1)
  })

  it('should count Bart or Homer by name', async () => {
    const doc = await personModel.findCount(
      {
        where: {
          firstName: { equals: ['Homer', 'Bart'] },
          lastName: { equals: 'Simpson' }
        }
      }
    )
    expect(doc).to.eql(2)
  })

  it('shouldn\'t count one missing person', async () => {
    const doc = await personModel.findCount(
      {
        where: {
          firstName: { equals: 'Ned' },
          lastName: { equals: 'Flanders' }
        }
      }
    )
    expect(doc).to.eql(0)
  })

  it('should find 5 people, youngest first', async function () {
    const doc = await personModel.find(
      {
        orderBy: ['age']
      }
    )

    expect(doc.length).to.eql(5)
    expect(doc).to.containSubset(
      [
        {
          age: 8,
          employeeNo: 3,
          firstName: 'Lisa',
          lastName: 'Simpson'
        },
        {
          age: 10,
          employeeNo: 5,
          firstName: 'Bart',
          lastName: 'Simpson'
        },
        {
          age: 36,
          employeeNo: 4,
          firstName: 'Marge',
          lastName: 'Simpson'
        },
        {
          age: 39,
          employeeNo: 1,
          firstName: 'Homer',
          lastName: 'Simpson'
        },
        {
          employeeNo: 2,
          firstName: 'Maggie',
          lastName: 'Simpson'
        }
      ]
    )
  })

  it('should find 3 youngest people', async function () {
    const doc = await personModel.find(
      {
        orderBy: ['age'],
        limit: 3
      }
    )

    expect(doc.length).to.eql(3)
    expect(doc).to.containSubset(
      [
        {
          age: 8,
          employeeNo: 3,
          firstName: 'Lisa',
          lastName: 'Simpson'
        },
        {
          age: 10,
          employeeNo: 5,
          firstName: 'Bart',
          lastName: 'Simpson'
        },
        {
          age: 36,
          employeeNo: 4,
          firstName: 'Marge',
          lastName: 'Simpson'
        }
      ]
    )
  })

  it('should find 5 youngest people, except for the first', async function () {
    const doc = await personModel.find(
      {
        orderBy: ['age'],
        offset: 1
      }
    )

    expect(doc.length).to.eql(4)
    expect(doc).to.containSubset(
      [
        {
          age: 10,
          employeeNo: 5,
          firstName: 'Bart',
          lastName: 'Simpson'
        },
        {
          age: 36,
          employeeNo: 4,
          firstName: 'Marge',
          lastName: 'Simpson'
        },
        {
          age: 39,
          employeeNo: 1,
          firstName: 'Homer',
          lastName: 'Simpson'
        },
        {
          employeeNo: 2,
          firstName: 'Maggie',
          lastName: 'Simpson'
        }
      ]
    )
  })

  describe('searching', () => {
    it('search all documents without options', async () => {
      const doc = await personModel.search()
      expect(doc.page).to.eql(1)
      expect(doc.totalPages).to.eql(1)
      expect(doc.totalHits).to.eql(5)
      expect(doc.results.length).to.eql(5)
    })

    it('search all documents with offset as 2', async () => {
      const doc = await personModel.search({ offset: 2 })
      expect(doc.page).to.eql(1)
      expect(doc.totalPages).to.eql(1)
      expect(doc.totalHits).to.eql(5)
      expect(doc.results.length).to.eql(3)
    })

    it('search all documents with limit as 2', async () => {
      const doc = await personModel.search({ limit: 2 })
      expect(doc.page).to.eql(1)
      expect(doc.totalPages).to.eql(3)
      expect(doc.totalHits).to.eql(5)
      expect(doc.results.length).to.eql(2)
    })

    it('search all documents with limit as 2 and page as 2', async () => {
      const doc = await personModel.search({ limit: 2, page: 2 })
      expect(doc.page).to.eql(2)
      expect(doc.totalPages).to.eql(3)
      expect(doc.totalHits).to.eql(5)
      expect(doc.results.length).to.eql(2)
    })

    it('search all documents with limit as 2 and offset as 4', async () => {
      const doc = await personModel.search({ limit: 2, offset: 4 })
      expect(doc.totalPages).to.eql(3)
      expect(doc.totalHits).to.eql(5)
      expect(doc.results.length).to.eql(1)
    })

    it('search all documents with filter on and order by age', async () => {
      const doc = await personModel.search({
        orderBy: ['-age'],
        fields: ['firstName', 'lastName'],
        where: {
          age: { moreThan: 30 }
        }
      })
      expect(doc.page).to.eql(1)
      expect(doc.totalPages).to.eql(1)
      expect(doc.totalHits).to.eql(2)
      expect(doc.results.length).to.eql(2)
      expect(doc.results[0].firstName).to.eql('Homer')
      expect(
        Object.keys(doc.results[0]).sort()
      ).to.eql(
        ['firstName', 'lastName']
      )
    })
  })

  it('should find Bart by name', async () => {
    const doc = await personModel.find(
      {
        where: {
          firstName: { equals: 'Bart' },
          lastName: { equals: 'Simpson' }
        }
      }
    )

    expect(doc).to.have.length(1)
    expect(doc).to.containSubset(
      [
        {
          age: 10,
          employeeNo: 5,
          firstName: 'Bart',
          lastName: 'Simpson'
        }
      ]
    )
  })

  it('should get one Homer by name', function () {
    return personModel.findOne(
      {
        where: {
          firstName: { equals: 'Homer' },
          lastName: { equals: 'Simpson' }
        }
      }
    ).then(doc =>
      expect(doc).to.containSubset(
        {
          age: 39,
          employeeNo: 1,
          firstName: 'Homer',
          lastName: 'Simpson'
        }
      )
    )
  })

  it('find Bart or Homer by name', async () => {
    const doc = await personModel.findOne(
      {
        where: {
          firstName: { equals: ['Homer', 'Bart'] },
          lastName: { equals: 'Simpson' }
        }
      }
    )
    expect(doc).to.containSubset(
      {
        age: 39,
        employeeNo: 1,
        firstName: 'Homer',
        lastName: 'Simpson'
      },
      {
        age: 10,
        employeeNo: 5,
        firstName: 'Bart',
        lastName: 'Simpson'
      }
    )
  })

  it("shouldn't get one missing person", async () => {
    const doc = await personModel.findOne(
      {
        where: {
          firstName: { equals: 'Ned' },
          lastName: { equals: 'Flanders' }
        }
      }
    )

    expect(doc).to.equal(undefined)
  })

  it("should update Maggie's age to 1", () => {
    return personModel.update(
      {
        employeeNo: 2,
        age: 1,
        firstName: 'Maggie',
        lastName: 'Simpson'
      },
      {}
    )
  })

  it('should find Maggie has an age now', () => {
    personModel.findById(2)
      .then(doc =>
        expect(doc).to.containSubset(
          {
            employeeNo: 2,
            firstName: 'Maggie',
            lastName: 'Simpson',
            age: 1
          }
        )
      )
  })

  it('should update Maggie again, but this time without an age', async () => {
    await personModel.update(
      {
        employeeNo: 2,
        firstName: 'Maggie',
        lastName: 'Simpson'
      },
      {}
    )
  })

  it("should find Maggie's age has gone again", async () => {
    const doc = await personModel.findById(2)

    expect(doc).to.containSubset(
      {
        employeeNo: 2,
        firstName: 'Maggie',
        lastName: 'Simpson'
      }
    )
  })

  it('should patch Maggie to Margaret', function (done) {
    personModel.patch(
      {
        employeeNo: 2,
        firstName: 'Margaret'
      },
      {}
    ).then(() => done())
  })

  it('should find Maggie is now a Margaret', async () => {
    const doc = await personModel.findById(2)

    expect(doc).to.containSubset(
      {
        employeeNo: 2,
        firstName: 'Margaret',
        lastName: 'Simpson'
      }
    )
  })

  it('should delete Maggie/Margaret by via her id', function (done) {
    personModel.destroyById(2).then(() => done())
  })

  it('should fail getting a deleted record', async () => {
    const doc = await personModel.findById(2)
    expect(doc).to.equal(undefined)
  })

  it('should upsert (insert) Grampa', () => {
    personModel.upsert(
      {
        employeeNo: 10,
        firstName: 'Abe',
        lastName: 'Simpson',
        age: 82
      },
      {}
    ).then(idProperties =>
      expect(idProperties).to.eql(
        {
          idProperties: {
            employeeNo: 10
          }
        }
      )
    )
  })

  it('should find Grampa has been inserted via upsert', async () => {
    const doc = await personModel.findById(10)
    expect(doc).to.containSubset(
      {
        employeeNo: 10,
        firstName: 'Abe',
        lastName: 'Simpson',
        age: 82
      }
    )
  })

  it('should upsert (update) Grampa', function (done) {
    personModel.upsert(
      {
        employeeNo: 10,
        firstName: 'Abraham',
        lastName: 'Simpson',
        age: 82
      },
      {}
    ).then(() => done())
  })

  it('should find Grampa has now been updates via upsert', async () => {
    const doc = await personModel.findById(10)
    expect(doc).to.containSubset(
      {
        employeeNo: 10,
        firstName: 'Abraham',
        lastName: 'Simpson',
        age: 82
      }
    )
  })

  it('should now upsert (update) Grampa, resetting his name', (done) => {
    personModel.upsert(
      {
        employeeNo: 10,
        firstName: 'Abe',
        lastName: 'Simpson'
      },
      {
        setMissingPropertiesToNull: false
      }
    ).then(() => done())
  })

  it('should find Grampa again, with his age preserved and an updated name', async () => {
    const doc = await personModel.findById(10)
    expect(doc).to.containSubset(
      {
        employeeNo: 10,
        firstName: 'Abe',
        lastName: 'Simpson',
        age: 82
      }
    )
  })

  it('should upsert (update) Grampa again, but turn age to null', function (done) {
    personModel.upsert(
      {
        employeeNo: 10,
        firstName: 'Abraham',
        lastName: 'Simpson'
      },
      {}
    ).then(() => done())
  })

  it('should find Grampa again, but now with a null age', async () => {
    const doc = await personModel.findById(10)
    expect(doc).to.containSubset(
      {
        employeeNo: 10,
        firstName: 'Abraham',
        lastName: 'Simpson'
      }
    )
  })

  it('should create mars, with two moons and a few craters', function (done) {
    planetsModel.create(
      {
        name: 'mars',
        title: 'Mars',
        type: 'Terrestrial',
        diameter: 6700,
        color: 'red',
        url: 'http://en.wikipedia.org/wiki/Mars',
        otherFacts: {
          radius: 3390,
          surfacePressure: '0.636 (0.4–0.87) kPa; 0.00628 atm',
          equatorialRotationVelocity: '868.22 km/h (241.17 m/s)'
        },
        moons: [
          {
            title: 'Phobos',
            discoveredBy: 'Asaph Hall',
            discoveryYear: 1800,
            craters: [
              {
                title: 'Stickney',
                diameter: 9
              }
            ]
          },
          {
            title: 'Deimos',
            discoveredBy: 'Asaph Hall',
            discoveryYear: 1800
          }
        ]
      },
      {},
      function (err, idProperties) {
        expect(err).to.equal(null)
        expect(idProperties).to.eql(
          {
            idProperties: {
              name: 'mars'
            }
          }
        )
        done()
      }
    )
  })

  it('should find Mars via primary key', function (done) {
    planetsModel.findById(
      'mars',
      function (err, doc) {
        expect(err).to.equal(null)
        expect(doc).to.containSubset(
          {
            name: 'mars',
            title: 'Mars',
            type: 'Terrestrial',
            diameter: 6700,
            color: 'red',
            url: 'http://en.wikipedia.org/wiki/Mars',
            otherFacts: {
              radius: 3390,
              surfacePressure: '0.636 (0.4–0.87) kPa; 0.00628 atm',
              equatorialRotationVelocity: '868.22 km/h (241.17 m/s)'
            },
            moons: [
              {
                title: 'Phobos',
                discoveredBy: 'Asaph Hall',
                discoveryYear: 1800,
                craters: [
                  {
                    title: 'Stickney',
                    diameter: 9
                  }
                ]
              },
              {
                title: 'Deimos',
                discoveredBy: 'Asaph Hall',
                discoveryYear: 1800
              }
            ]
          }
        )

        done()
      }
    )
  })

  it('should delete Mars', function (done) {
    planetsModel.destroyById('mars')
      .then(() => done())
  })

  it('should now fail to find Mars', () => {
    return planetsModel.findById('mars')
      .then(doc => expect(doc).to.equal(undefined))
  })
})
