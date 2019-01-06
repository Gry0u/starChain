const LevelDB = require('./LevelDB.js')
const Request = require('./Request.js')
const bitcoinMessage = require('bitcoinjs-message')
const TimeoutRequestsWindowTime = 5 * 60 * 1000 // 5 minutes

class MemPool extends LevelDB.LevelDB {
  async addValidationRequest (address) {
    // Check if there already already a validation request in the mempool
    try {
      let request = JSON.parse(await this.getLevelDBData(address))
      // Check if expired
      const timeElapse = (new Date().getTime().toString().slice(0, -3)) - request.requestTimeStamp
      const timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse
      if (timeLeft > 0) {
        // Reduce validation window
        request.validationWindow = timeLeft
        return request
      } else {
        // if existing but expired previous request, delete it and submit a new one
        this.deleteLevelDBData(address)
        const request = new Request.Request(address)
        console.log('Previous request deleted, new one added')
        return JSON.parse(await this.addLevelDBData(address, JSON.stringify(request)))
      }
    } catch (err) {
      // if no request in mempool for this address, submit new one
      const request = new Request.Request(address)
      return JSON.parse(await this.addLevelDBData(address, JSON.stringify(request)))
    }
  }
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
        this.deleteLevelDBData(address)
        return 'Request expired and was hence deleted from the mempool. Submit again a validation request at /requestValidation'
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

  async verifyAddressRequest (address) {
    return this.getLevelDBData(address).messageSignature
  }
}

module.exports.MemPool = MemPool
