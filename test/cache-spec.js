/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('./../lib')

describe('Cache tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService, cacheService

  before('boot Tymly', async () => {
    const tymlyServices = await tymly.boot({
      config: {
        caches: {
          users: { max: 500 }
        }
      }
    })

    tymlyService = tymlyServices.tymly
    cacheService = tymlyServices.caches
  })

  it('set something in the cache', () => {
    cacheService.set('users', 'user1', 'user-one', 1000)
  })

  it('check \'has\' function', () => {
    expect(cacheService.has('users', 'user1')).to.eql(true)
    expect(cacheService.has('users', 'user2')).to.eql(false)
  })

  it('get the cache', () => {
    expect(cacheService.get('users', 'user1')).to.eql('user-one')
  })

  it('delete the cache', () => {
    cacheService.delete('users', 'user1')
  })

  it('check the key has been removed from the cahce', () => {
    expect(cacheService.has('users', 'user1')).to.eql(false)
  })

  it('add more things to the cache', () => {
    cacheService.set('users', 'user1', 'user-one')
    cacheService.set('users', 'user2', 'user-two')
  })

  it('check the things have been added to the cache', () => {
    expect(cacheService.has('users', 'user1')).to.eql(true)
    expect(cacheService.has('users', 'user2')).to.eql(true)
  })

  it('reset the cache', () => {
    cacheService.clear('users')
  })

  it('check the cache is empty', () => {
    expect(cacheService.has('users', 'user1')).to.eql(false)
    expect(cacheService.has('users', 'user2')).to.eql(false)
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
