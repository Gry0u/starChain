class Request {
  constructor (walletAddress) {
    this.walletAddress = walletAddress
    this.requestTimeStamp = new Date().getTime().toString().slice(0, -3)
    this.validationWindow = 300
    this.message = `${this.walletAddress}:${this.requestTimeStamp}:starRegistry`
  }
}

module.exports.Request = Request
