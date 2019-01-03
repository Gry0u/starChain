/* Controller to manage routes of Web API
*/
const BlockClass = require('./Block.js')
const BlockChain = require('./BlockChain.js')
const MemPool = require('./MemPool.js')

let blockchain = new BlockChain.Blockchain('data/chain')
let mempool = new MemPool.MemPool('data/mempool')

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
    this.requestValidation()
    this.validate()
    this.addStar()
    this.getStarByHash()
    this.getStarsByWallet()
    this.getStarByHeight()
  }

  // GET Endpoint to retrieve a star block by height, url: "block/[HEIGHT]"
  getStarByHeight () {
    this.server.route({
      method: 'GET',
      path: '/block/{height}',
      handler: (request, h) => {
        return blockchain.getBlock(request.params.height)
      }
    })
  }

  // GET Endpoint to retrieve a star block by hash, url: "/stars/hash:[HASH]"
  getStarByHash () {
    this.server.route({
      method: 'GET',
      path: '/stars/hash:{hash}',
      handler: (request, h) => {

      }
    })
  }

  // GET Endpoint to retrieve star blocks by wallet address, url: "/stars/address:[ADDRESS]"
  getStarsByWallet () {
    this.server.route({
      method: 'GET',
      path: '/stars/address:{address}',
      handler: (request, h) => {

      }
    })
  }

  // POST Endpoint to add a new Star Block, url: "/block"
  // request data:
  addStar () {
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
  // request data: "address=..."
  requestValidation () {
    this.server.route({
      method: 'POST',
      path: '/requestValidation',
      handler: async (request, h) => {
        return JSON.parse(await mempool.addValidationRequest(request.payload.address))
      }
    })
  }

  // POST Endpoint to validate message signatures
  // request data: "address=...&signature=..."
  validate () {
    this.server.route({
      method: 'POST',
      path: '/message-signature/validate',
      handler: (request, h) => {

      }
    })
  }
}
//
// * Exporting the BlockController class
// * @param {*} server
//
module.exports = (server) => { return new BlockController(server) }
