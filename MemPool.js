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
    this.mempool.push(request)
    setTimeout(_ => { this.removeValidationRequest(request.walletAddress) }, TimeoutRequestsWindowTime)
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
