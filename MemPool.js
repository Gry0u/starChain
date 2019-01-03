const LevelDB = require('./LevelDB.js')
const Request = require('./Request.js')
const bitcoinMessage = require('bitcoinjs-message')

class MemPool extends LevelDB.LevelDB {
  async addValidationRequest (address) {
    const request = new Request.Request(address)
    return this.addLevelDBData(address, JSON.stringify(request))
  }
  // TODO: configure limited validation window of 5 minutes
  // TODO: reduce val window when resubmitting a request

  async validateRequestByWallet (address, signature) {
    // get request from mempool
    const request = JSON.parse(await this.getLevelDBData(address))
    // verify signature
    const isValid = bitcoinMessage.verify(request.message, address, signature)
    // add messageSignature prop to request object
    request.messageSignature = isValid
    this.addLevelDBData(address, JSON.stringify(request))

    return {
      'registerStar': isValid,
      'status': request
    }
  }

  verifyAddressRequest () {

  }
}

module.exports.MemPool = MemPool
