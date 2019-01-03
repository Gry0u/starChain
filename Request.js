class Request {
  constructor (walletAddress) {
    this.address = address
    this.requestTimeStamp = new Date().getTime().toString().slice(0, -3)
    this.validationWindow = 300
    this.message = `${this.address}:${this.requestTimeStamp}:starRegistry`
  }
}

module.exports.Request = Request
