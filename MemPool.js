const LevelDB = require('./LevelDB.js')
const Request = require('./Request.js')

class MemPool extends LevelDB.LevelDB {
  async addValidationRequest (address) {
    const request = new Request.Request(address)
    return this.addLevelDBData(address, JSON.stringify(request))
  }

  validateRequestByWallet () {

  }

  verifyAddressRequest () {

  }
}

module.exports.MemPool = MemPool
