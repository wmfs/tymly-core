/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('./../lib')

describe('Cache tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService, cacheService

  it('should boot Tymly', async () => {
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

  it('should set something in the cache', () => {
    cacheService.set('users', 'user1', 'user-one', 1000)
  })

  it('should check \'has\' function', () => {
    expect(cacheService.has('users', 'user1')).to.eql(true)
    expect(cacheService.has('users', 'user2')).to.eql(false)
  })

  it('should get the cache', () => {
    expect(cacheService.get('users', 'user1')).to.eql('user-one')
  })

  it('should delete the cache', () => {
    cacheService.del('users', 'user1')
  })

  it('should check the key has been removed from the cahce', () => {
    expect(cacheService.has('users', 'user1')).to.eql(false)
  })

  it('should add more things to the cache', () => {
    cacheService.set('users', 'user1', 'user-one')
    cacheService.set('users', 'user2', 'user-two')
  })

  it('should check the things have been added to the cache', () => {
    expect(cacheService.has('users', 'user1')).to.eql(true)
    expect(cacheService.has('users', 'user2')).to.eql(true)
  })

  it('should reset the cache', () => {
    cacheService.reset('users')
  })

  it('should check the cache is empty', () => {
    expect(cacheService.has('users', 'user1')).to.eql(false)
    expect(cacheService.has('users', 'user2')).to.eql(false)
  })

  it('should shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
