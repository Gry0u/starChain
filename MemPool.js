class MemPool {
  constructor () {
    this.mempool = []
    // this.timeoutRequests = {}
  }

  removeValidationRequest (walletAddress) {
    this.mempool = this.mempool.filter(valRequest => {
      return valRequest.walletAddress !== walletAddress
    })
  }

  addValidationRequest (request) {
    const TimeoutRequestsWindowTime = 5 * 60 * 1000
    // if request already in mempool, reduce validation window
    if (this.mempool.filter(valRequest => {
      return valRequest.walletAddress === request.walletAddress
    }).length) {
      const timeElapse = (new Date().getTime().toString().slice(0, -3)) - request.requestTimeStamp
      const timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse
      request.validationWindow = timeLeft
    } else {
      // Otherwise just add request to mempool
      this.mempool.push(request)
      // Remove automatically request from mempool after 5 minutes
      setTimeout(_ => { this.removeValidationRequest(request.walletAddress) }, TimeoutRequestsWindowTime)
    }
  }
}
module.exports.MemPool = MemPool

// self.timeoutRequests[request.walletAddress]=setTimeout(function(){ self.removeValidationRequest(request.walletAddress) }, TimeoutRequestsWindowTime );
//
// const TimeoutRequestsWindowTime = 5*60*1000;
//
// let timeElapse = (new Date().getTime().toString().slice(0,-3)) - req.requestTimeStamp;
// let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
// req.validationWindow = timeLeft;
