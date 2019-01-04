const LevelDB = require('./LevelDB.js')
const Request = require('./Request.js')
const bitcoinMessage = require('bitcoinjs-message')
<<<<<<< HEAD
const TimeoutRequestsWindowTime = 5 * 60 * 1000 // 5 minutes

||||||| merged common ancestors

=======
const TimeoutRequestsWindowTime = 5 * 60 * 1000 // 5 minutes
>>>>>>> 4ebe95bf297c928b256a113e424f34d4a7b78cce
class MemPool extends LevelDB.LevelDB {
  async addValidationRequest (address) {
    const request = new Request.Request(address)
    return this.addLevelDBData(address, JSON.stringify(request))
  }
  // TODO: configure limited validation window of 5 minutes
  // TODO: reduce val window when resubmitting a request

  async validateRequestByWallet (address, signature) {
    // get request from mempool
<<<<<<< HEAD
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
||||||| merged common ancestors
    const request = JSON.parse(await this.getLevelDBData(address))
    // verify signature
    const isValid = bitcoinMessage.verify(request.message, address, signature)
    // add messageSignature prop to request object
    request.messageSignature = isValid
    this.addLevelDBData(address, JSON.stringify(request))

    return {
      'registerStar': isValid,
      'status': request
=======
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
>>>>>>> 4ebe95bf297c928b256a113e424f34d4a7b78cce
    }
  }

<<<<<<< HEAD
  async verifyAddressRequest (address) {
    const request = JSON.parse(await this.getLevelDBData(address))
    return request
||||||| merged common ancestors
  verifyAddressRequest () {

=======
  async verifyAddressRequest (address) {
    return this.getLevelDBData(address).messageSignature
>>>>>>> 4ebe95bf297c928b256a113e424f34d4a7b78cce
  }
}

module.exports.MemPool = MemPool
