/* eslint-env mocha */

const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const expect = chai.expect
const tymly = require('../lib')
const path = require('path')

describe('Memory storage tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let storage
  let people
  let planets
  let star

  describe('start up', () => {
    it('should create some out-the-box tymly services to test memory storage state-machines', (done) => {
      tymly.boot(
        {
          blueprintPaths: [
            path.resolve(__dirname, './fixtures/blueprints/people-blueprint'),
            path.resolve(__dirname, './fixtures/blueprints/space-blueprint')
          ]
        },
        function (err, tymlyServices) {
          expect(err).to.eql(null)
          tymlyService = tymlyServices.tymly
          storage = tymlyServices.storage
          const models = storage.models
          people = models.tymlyTest_people
          planets = models.tymlyTest_planets
          star = models.tymlyTest_star

          star.findById('Arcturus')
            .then(seededStar => expect(seededStar.name).to.eql('Arcturus'))
            .then(() => planets.findById('Mercury'))
            .then(seededPlanet => expect(seededPlanet.name).to.eql('Mercury'))
            .then(() => done())
            .catch(err => done(err))
        }
      )
    })
  })

  describe('single table', () => {
    it('should create a new person', function (done) {
      people.create(
        {
          employeeNo: '1',
          firstName: 'Homer',
          lastName: 'Simpson',
          age: 39
        },
        {},
        function (err, idProperties) {
          expect(err).to.equal(null)
          expect(idProperties).to.eql(
            {
              idProperties:
                { employeeNo: '1' }
            }
          )
          done()
        }
      )
    })

    it('should create multiple new people', function (done) {
      people.create(
        [
          {
            employeeNo: '2',
            firstName: 'Maggie',
            lastName: 'Simpson'
          },
          {
            employeeNo: '3',
            firstName: 'Lisa',
            lastName: 'Simpson',
            age: 8
          },
          {
            employeeNo: '4',
            firstName: 'Marge',
            lastName: 'Simpson',
            age: 36
          },
          {
            employeeNo: '5',
            firstName: 'Bart',
            lastName: 'Simpson',
            age: 10
          }

        ],
        {},
        function (err) {
          expect(err).to.equal(null)
          done()
        }
      )
    })

    it('should fail creating a new person with an already-used primary key', function (done) {
      people.create(
        {
          employeeNo: '1',
          firstName: 'Ned',
          lastName: 'Flanders',
          age: 60
        },
        {},
        function (err) {
          console.log(err)
          expect(err).to.eql(
            {
              name: 'DuplicatePrimaryKey',
              message: 'Unable to create model \'people\' because {"employeeNo":"1"} already exists'
            }
          )
          done()
        }
      )
    })

    it('should fail creating new people with an already-used primary key', function (done) {
      people.create(
        [
          {
            employeeNo: '6',
            firstName: 'Ned',
            lastName: 'Flanders',
            age: 60
          },
          {
            employeeNo: '2',
            firstName: 'Maude',
            lastName: 'Flanders'
          }
        ],
        {},
        function (err) {
          expect(err).to.eql(
            {
              name: 'DuplicatePrimaryKey',
              message: 'Unable to create model \'people\' because {"employeeNo":"2"} already exists'
            }
          )
          done()
        }
      )
    })

    it('should find a person via primary key', function (done) {
      people.findById(
        '3',
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.containSubset(
            {
              employeeNo: '3',
              firstName: 'Lisa',
              lastName: 'Simpson',
              age: 8
            }
          )
          done()
        }
      )
    })

    it('should fail finding a person that\'s not there', function (done) {
      people.findById(
        '0',
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.equal(undefined)
          done()
        }
      )
    })

    it('should find 5 people, youngest first', function (done) {
      people.find(
        {
          orderBy: ['age']
        },
        function (err, doc) {
          expect(err).to.equal(null)

          expect(doc[0].age).to.equal(8)
          expect(doc[1].age).to.equal(10)
          expect(doc[2].age).to.equal(36)
          expect(doc[3].age).to.equal(39)
          expect(doc).to.containSubset(
            [
              {
                age: 8,
                employeeNo: '3',
                firstName: 'Lisa',
                lastName: 'Simpson'
              },
              {
                age: 10,
                employeeNo: '5',
                firstName: 'Bart',
                lastName: 'Simpson'
              },
              {
                age: 36,
                employeeNo: '4',
                firstName: 'Marge',
                lastName: 'Simpson'
              },
              {
                age: 39,
                employeeNo: '1',
                firstName: 'Homer',
                lastName: 'Simpson'
              },
              {
                age: 60,
                employeeNo: '6',
                firstName: 'Ned',
                lastName: 'Flanders'
              },
              {
                employeeNo: '2',
                firstName: 'Maggie',
                lastName: 'Simpson'
              }
            ]
          )
          done()
        }
      )
    })

    it('should find Bart by name', function (done) {
      people.find(
        {
          where: {
            firstName: { equals: 'Bart' },
            lastName: { equals: 'Simpson' }
          }
        },
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.have.length(1)
          expect(doc).to.containSubset(
            [
              {
                age: 10,
                employeeNo: '5',
                firstName: 'Bart',
                lastName: 'Simpson'
              }
            ]
          )

          done()
        }
      )
    })

    it('should find who is older than 30', function (done) {
      people.find(
        {
          where: {
            age: { moreThan: 30 }
          }
        },
        function (err, doc) {
          expect(doc.length).to.eql(3)
          expect(doc[0].firstName).to.eql('Homer')
          expect(doc[1].firstName).to.eql('Marge')
          expect(doc[2].firstName).to.eql('Ned')
          done(err)
        }
      )
    })

    it('should find who is older than or equal to 39', function (done) {
      people.find(
        {
          where: {
            age: { moreThanEquals: 39 }
          }
        },
        function (err, doc) {
          expect(doc.length).to.eql(2)
          expect(doc[0].firstName).to.eql('Homer')
          expect(doc[1].firstName).to.eql('Ned')
          done(err)
        }
      )
    })

    it('should find who is younger than 10', function (done) {
      people.find(
        {
          where: {
            age: { lessThan: 10 }
          }
        },
        function (err, doc) {
          expect(doc.length).to.eql(1)
          expect(doc[0].firstName).to.eql('Lisa')
          done(err)
        }
      )
    })

    it('should find who is younger than or equal to 10', function (done) {
      people.find(
        {
          where: {
            age: { lessThanEquals: 10 }
          }
        },
        function (err, doc) {
          expect(doc.length).to.eql(2)
          expect(doc[0].firstName).to.eql('Lisa')
          expect(doc[1].firstName).to.eql('Bart')
          done(err)
        }
      )
    })

    it('should find Marge and Homer (offset 2/limit 2)', function (done) {
      people.find(
        {
          orderBy: ['age'],
          limit: 2,
          offset: 2
        },
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.have.length(2)
          expect(doc[0].employeeNo).to.eql('4')
          expect(doc[1].employeeNo).to.eql('1')
          expect(doc).to.containSubset(
            [
              {
                employeeNo: '4',
                firstName: 'Marge',
                lastName: 'Simpson',
                age: 36
              },
              {
                employeeNo: '1',
                firstName: 'Homer',
                lastName: 'Simpson',
                age: 39
              }
            ]
          )
          done()
        }
      )
    })

    it('should get the second youngest known person (Marge)', function (done) {
      people.findOne(
        {
          orderBy: ['age'],
          offset: 1
        },
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.containSubset(
            {
              age: 10,
              employeeNo: '5',
              firstName: 'Bart',
              lastName: 'Simpson'
            }
          )

          done()
        }
      )
    })

    it('should get one Homer by name', function (done) {
      people.findOne(
        {
          where: {
            firstName: { equals: 'Homer' },
            lastName: { equals: 'Simpson' }
          }
        },
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.containSubset(
            {
              age: 39,
              employeeNo: '1',
              firstName: 'Homer',
              lastName: 'Simpson'
            }
          )

          done()
        }
      )
    })

    it('shouldn\'t get one missing person', function (done) {
      people.findOne(
        {
          where: {
            firstName: { equals: 'Maude' },
            lastName: { equals: 'Flanders' }
          }
        },
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.equal(undefined)
          done()
        }
      )
    })

    it('should update Maggie\'s age to 1', function (done) {
      people.update(
        {
          employeeNo: '2',
          age: 1,
          firstName: 'Maggie',
          lastName: 'Simpson'
        },
        {},
        function (err) {
          expect(err).to.equal(null)
          done()
        }
      )
    })

    it('should find Maggie has an age now', function (done) {
      people.findById(
        '2',
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.containSubset(
            {
              employeeNo: '2',
              firstName: 'Maggie',
              lastName: 'Simpson',
              age: 1
            }
          )
          done()
        }
      )
    })

    it('should update Maggie again, but this time without an age', function (done) {
      people.update(
        {
          employeeNo: '2',
          firstName: 'Maggie',
          lastName: 'Simpson'
        },
        {},
        function (err, doc) {
          expect(err).to.equal(null)
          done()
        }
      )
    })

    it('should find Maggie\'s age has gone again', function (done) {
      people.findById(
        '2',
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.containSubset(
            {
              employeeNo: '2',
              firstName: 'Maggie',
              lastName: 'Simpson'
            }
          )
          done()
        }
      )
    })

    it('should delete Maggie/Margaret by via her id', function (done) {
      people.destroyById(
        '2',
        function (err, doc) {
          expect(err).to.equal(null)
          done()
        }
      )
    })

    it('should fail getting a deleted record', function (done) {
      people.findById(
        '2',
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.equal(undefined)
          done()
        }
      )
    })

    it('should upsert (insert) Grampa', function (done) {
      people.upsert(
        {
          employeeNo: '10',
          firstName: 'Abe',
          lastName: 'Simpson',
          age: 82
        },
        {},
        function (err, idProperties) {
          expect(idProperties).to.eql(
            {
              idProperties: {
                employeeNo: '10'
              }
            }
          )
          expect(err).to.equal(null)
          done()
        }
      )
    })

    it('should find Grampa has been inserted via upsert', function (done) {
      people.findById(
        '10',
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.containSubset(
            {
              employeeNo: '10',
              firstName: 'Abe',
              lastName: 'Simpson',
              age: 82
            }
          )
          done()
        }
      )
    })

    it('should upsert (update) Grampa', function (done) {
      people.upsert(
        {
          employeeNo: '10',
          firstName: 'Abraham',
          lastName: 'Simpson',
          age: 83
        },
        {},
        function (err, doc) {
          expect(err).to.equal(null)
          done()
        }
      )
    })

    it('should find Grampa has now been updates via upsert', function (done) {
      people.findById(
        '10',
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.containSubset(
            {
              employeeNo: '10',
              firstName: 'Abraham',
              lastName: 'Simpson',
              age: 83
            }
          )
          done()
        }
      )
    })
  })

  describe('reference data', () => {
    it('should find a star (reference table loaded as seed data) via primary key', function (done) {
      star.findById(
        'Proxima Centauri',
        function (err, doc) {
          expect(err).to.equal(null)
          expect(doc).to.containSubset(
            {
              name: 'Proxima Centauri',
              type: 'Red Dwarf'
            }
          )
          done()
        }
      )
    })
  })

  describe('related tables', () => {
    it('should create mars, with two moons and a few craters', function (done) {
      planets.create(
        {
          name: 'mars',
          title: 'Mars',
          type: 'Terrestrial',
          diameter: 6700,
          color: 'red',
          url: 'http://en.wikipedia.org/wiki/Mars',
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
  })

  describe('set created by and modified by', () => {
    it('create a new person', async () => {
      storage.setCurrentUser('test')

      const properties = await people.create(
        {
          employeeNo: '1000',
          firstName: 'James',
          lastName: 'Thompson',
          age: 39
        },
        {}
      )
      storage.setCurrentUser(null)

      expect(properties).to.eql(
        {
          idProperties: { employeeNo: '1000' }
        }
      )
    })

    it('find person, check createdBy', async () => {
      const doc = await people.findOne(
        {
          where: {
            employeeNo: { equals: '1000' }
          }
        }
      )

      expect(doc).to.eql(
        {
          employeeNo: '1000',
          firstName: 'James',
          lastName: 'Thompson',
          age: 39,
          createdBy: 'test'
        }
      )
    })

    it('upsert record', async () => {
      storage.setCurrentUser(() => 'modifier')
      await people.patch(
        {
          employeeNo: '1000',
          firstName: 'Jim'
        },
        {}
      )
      storage.setCurrentUser(null)
    })

    it('find person, check createdBy', async () => {
      const doc = await people.findOne(
        {
          where: {
            employeeNo: { equals: '1000' }
          }
        }
      )

      expect(doc).to.eql(
        {
          employeeNo: '1000',
          firstName: 'Jim',
          lastName: 'Thompson',
          age: 39,
          createdBy: 'test',
          modifiedBy: 'modifier'
        }
      )
    })
  })

  describe('clean up', () => {
    it('should shutdown Tymly', async () => {
      await tymlyService.shutdown()
    })
  })
})
