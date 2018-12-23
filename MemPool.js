class MemPool {
  constructor () {
    this.mempool = []
    this.timeoutRequests = []
  }

  addValidationRequest (request) {
    this.mempool.push(request)
  }
}
module.exports.MemPool = MemPool
