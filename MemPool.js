const LevelDB = require('./LevelDB.js')
const Request = require('./Request.js')
const bitcoinMessage = require('bitcoinjs-message')
const TimeoutRequestsWindowTime = 5 * 60 * 1000 // 5 minutes
class MemPool extends LevelDB.LevelDB {
  async addValidationRequest (address) {
    const request = new Request.Request(address)
    return this.addLevelDBData(address, JSON.stringify(request))
  }
  // TODO: configure limited validation window of 5 minutes
  // TODO: reduce val window when resubmitting a request

  async validateRequestByWallet (address, signature) {
    // get request from mempool
    let request = JSON.parse(await this.getLevelDBData(address))
    // verify that request found
    if (request) {
      // verify that request not expired
      const timeElapse = (new Date().getTime().toString().slice(0, -3)) - request.requestTimeStamp
      const timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse
      if (timeLeft < 0) {
        return 'Request expired. Submit again a validation request at /requestValidation'
      } else {
        // verify signature
        const isValid = bitcoinMessage.verify(request.message, address, signature)
        // update validationWindow
        request.validationWindow = timeLeft
        // add registerStar and messageSignature properties and persist request in DB
        request.messageSignature = isValid
        this.addLevelDBData(address, JSON.stringify(request))
        return {
          'registerStar': isValid,
          'status': request
        }
      }
    } else {
      return 'Request not found. Submit a validation request at /requestValidation'
    }
  }

  verifyAddressRequest () {

  }
}

module.exports.MemPool = MemPool
