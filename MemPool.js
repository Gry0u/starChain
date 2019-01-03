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
    // if found:
    if (request) {
      // verify whether request expired
      const timeElapse = (new Date().getTime().toString().slice(0, -3)) - request.requestTimeStamp
      const timeleft = TimeoutRequestsWindowTime - timeElapse
      if (timeleft <= 0) {
        return 'Request expired. Submit again at /requestValidation'
      } else {
        // verify signature
        const isValid = bitcoinMessage.verify(request.message, address, signature)
        // add messageSignature property to request object
        request.messageSignature = isValid
        // update validation window
        request.validationWindow = timeleft
        // Persist request in DB
        this.addLevelDBData(address, JSON.stringify(request))
        // return response object
        return {
          'registerStar': isValid,
          'status': request
        }
      }
    } else {
      return 'Request not found. Submit at /requestValidation'
    }
  }

  async verifyAddressRequest (address) {
    const request = JSON.parse(await this.getLevelDBData(address))
    return request
  }
}

module.exports.MemPool = MemPool
