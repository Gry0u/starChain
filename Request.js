class Request {
  constructor (walletAdress) {
    this.walletAdress = walletAdress
    this.requestTimeStamp = new Date().getTime().toString().slice(0, -3)
    this.validationWindow = 300
    this.message = `${this.walletAdress}:${this.requestTimeStamp}:starRegistry`
  }
}

module.exports.Request = Request
