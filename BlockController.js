const SHA256 = require('crypto-js/sha256')
const BlockClass = require('./Block.js')
const BlockChain = require('./BlockChain.js')
const MemPool = require('./MemPool.js')
const Request = require('./Request.js')

let blockchain = new BlockChain.Blockchain()
let mempool = new MemPool.MemPool()

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {
/**
     * Constructor to create a new BlockController
     * @param {*} server
     */
  constructor (server) {
    this.server = server
    this.getBlockByIndex()
    this.postNewBlock()
    this.requestValidation()
  }

  /* GET Endpoint to retrieve a block by index, url: "/api/block/:index" */
  getBlockByIndex () {
    this.server.route({
      method: 'GET',
      path: '/api/block/{index}',
      handler: (request, h) => {
        return blockchain.getBlock(request.params.index)
      }
    })
  }

  /**
     * POST Endpoint to add a new Block, url: "/api/block"
     */
  postNewBlock () {
    this.server.route({
      method: 'POST',
      path: '/api/block',
      handler: (request, h) => {
        // Check if content in the block
        if (request.payload.data) {
          const newBlock = new BlockClass.Block(request.payload.data)
          blockchain.addBlock(new BlockClass.Block(request.payload.data))
          return 'Block added \n' + JSON.stringify(newBlock)
        } else {
          return "Block to add doesn't have any content so wasn't added!"
        }
      }
    })
  }
  // POST Endpoint to submit a validation request
  requestValidation () {
    this.server.route({
      method: 'POST',
      path: '/requestValidation',
      handler: (request, h) => {
        const validationRequest = new Request.Request(request.payload.address)
        if (validationRequest.walletAdress) {
          mempool.addValidationRequest(validationRequest)
          return validationRequest
        } else {
          return 'Please provide an address in your request.'
        }
      }
    })
  }

  // POST Endpoint to submit a validation request
  vaidateMessageSignature () {
    this.server.route({
      method: 'POST',
      path: '/message-signature/validate',
      handler: (request, h) => {
        if (request.payload.address & request.payload.signature) {

        } else {
          return 'Please include both an address and signature in your request.'
        }
      }
    })
  }
}

/**
 * Exporting the BlockController class
 * @param {*} server
 */
module.exports = (server) => { return new BlockController(server) }
