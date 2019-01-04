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
      handler: async (request, h) => {
        return blockchain.getBlock(request.params.height)
      }
    })
  }

  // GET Endpoint to retrieve a star block by hash, url: "/stars/hash:[HASH]"
  getStarByHash () {
    this.server.route({
      method: 'GET',
      path: '/stars/hash:{hash}',
      handler: async (request, h) => {
        return JSON.parse(await blockchain.getBlockByHash(request.params.hash))
      }
    })
  }

  // GET Endpoint to retrieve star blocks by wallet address, url: "/stars/address:[ADDRESS]"
  getStarsByWallet () {
    this.server.route({
      method: 'GET',
      path: '/stars/address:{address}',
      handler: async (request, h) => {
        return blockchain.getBlocksByWallet(request.params.address)
      }
    })
  }

  // POST Endpoint to add a new Star Block, url: "/block"
  // request data: address=...&star={dec:.., ra: .., story:..}
  addStar () {
    this.server.route({
      method: 'POST',
<<<<<<< HEAD
      path: '/block',
      handler: (request, h) => {
        return mempool.verifyAddressRequest(request.payload.address)
||||||| merged common ancestors
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
=======
      path: '/block',
      handler: async (request, h) => {
        // Check that address is verified
        const isValid = mempool.verifyAddressRequest(request.payload.address)
        if (isValid) {
          // Encode data
          const { ra, dec, mag, cen, story } = request.payload.star
          const body = {
            address: request.payload.address,
            ra: ra,
            dec: dec,
            mag: mag,
            cen: cen,
            story: Buffer.from(story).toString('hex')
          }
          // add block
          return JSON.parse(await blockchain.addBlock(new BlockClass.Block(body)))
        } else {
          return 'Address not verified. Validate your address at /message-signature/validate'
        }
>>>>>>> 4ebe95bf297c928b256a113e424f34d4a7b78cce
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
        return mempool.validateRequestByWallet(request.payload.address, request.payload.signature)
      }
    })
  }
}
//
// * Exporting the BlockController class
// * @param {*} server
//
module.exports = (server) => { return new BlockController(server) }
