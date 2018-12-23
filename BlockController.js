const SHA256 = require('crypto-js/sha256')
const BlockClass = require('./Block.js')
const BlockChain = require('./BlockChain.js')
let blockchain = new BlockChain.Blockchain()
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
        let response = {
          walletAdress: request.payload.address,
          requestTimeStamp: new Date().getTime().toString().slice(0, -3),
          validationWindow: 300
        }
        response.message = `${request.payload.address}:${response.requestTimeStamp}:starRegistry`
        if (request.payload.address) {
          return response
        } else {
          return 'Please provide an address in your request.'
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
