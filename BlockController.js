/* REST API
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
        return blockchain.getBlockByHash(request.params.hash)
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
      path: '/block',
      handler: async (request, h) => {
        // Check that address is verified
        const isValid = await mempool.verifyAddressRequest(request.payload.address)
        if (isValid) {
          // Encode data
          const { ra, dec, mag, cen, story } = request.payload.star
          // Check that at least ra, dec and body are defined
          if (ra && dec && story) {
            const body = {
              address: request.payload.address,
              star: {
                ra: ra,
                dec: dec,
                mag: mag,
                cen: cen,
                story: Buffer.from(story).toString('hex')
              }
            }
            // invalidate address to prevent resubmission of star without prior address verification
            mempool.deleteLevelDBData(request.payload.address)
            // add block
            return JSON.parse(await blockchain.addBlock(new BlockClass.Block(body)))
          } else {
            return 'Provide ra, dec and story parameters in your request.'
          }
        } else {
          return "This address hasn't been verified yet or need to be validated again before registering another star. Validate your address at /message-signature/validate"
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
        return mempool.addValidationRequest(request.payload.address)
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
