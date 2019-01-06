const test = require('ava')
const rp = require('request-promise')
const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')
const SERVER_URL = 'http://localhost:8000'
const app = require('../app')
const keyPair = bitcoin.ECPair.makeRandom()
const privateKey = keyPair.privateKey
const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
const optionsRequestValidation = {
  method: 'POST',
  uri: SERVER_URL + '/requestValidation',
  body: { address: address },
  json: true
}

const optionsGetBlockByIndex = {
  method: 'GET',
  uri: SERVER_URL + '/block/1',
  json: true
}

const optionsGetBlocksByWallet = {
  method: 'GET',
  uri: SERVER_URL + '/stars/address:' + address,
  json: true
}

test.serial('1. /requestValidation: returns a Request JSON object', async t => {
  const requestObject = await rp(optionsRequestValidation)
  t.is(requestObject.address, address)
  t.is(requestObject.validationWindow, 300)
  t.is(requestObject.message, `${address}:${requestObject.requestTimeStamp}:starRegistry`)
})

test.serial('2. /message-signature/validate: returns a JSON object with registerStar and status.messageSignature properties true', async t => {
  const message = (await rp(optionsRequestValidation)).message
  const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')
  const optionsMessageSignature = {
    method: 'POST',
    uri: SERVER_URL + '/message-signature/validate',
    body: {
      address: address,
      signature: signature
    },
    json: true
  }
  const validRequestObj = await rp(optionsMessageSignature)
  t.true(validRequestObj.registerStar)
  t.true(validRequestObj.status.messageSignature)
  t.is(validRequestObj.status.address, address)
})

test.serial('3. /block: adds a star block to the blockchain. Returns the added block as JSON object', async t => {
  const optionsAddBlock = {
    method: 'POST',
    uri: SERVER_URL + '/block',
    body: {
      address: address,
      star: {
        dec: "68° 52' 56.9",
        ra: '16h 29m 1.0s',
        story: 'Star added for test purposes'
      }
    },
    json: true
  }
  const starBlock = await rp(optionsAddBlock)
  t.truthy(starBlock.hash)
  t.truthy(starBlock.height)
  t.truthy(starBlock.body.star.story)
  t.truthy(starBlock.time)
  t.truthy(starBlock.previousBlockHash)
  t.is(starBlock.body.address, address)
})

test.serial('4. /block/[INDEX]: returns block of the corresponding height as JSON object', async t => {
  const block = await rp(optionsGetBlockByIndex)
  t.is(block.height, 1)
  t.is(block.body.star.storyDecoded, 'Star added for test purposes')
})

test.serial('5. /stars/hash:[HASH]: returns block of the corresponding hash as JSON object', async t => {
  const hash = (await rp(optionsGetBlockByIndex)).hash
  const optionsGetBlockByHash = {
    method: 'GET',
    uri: SERVER_URL + '/stars/hash:' + hash
  }
  const block = JSON.parse(await rp(optionsGetBlockByHash))
  t.is(block.height, 1)
  t.is(block.body.star.storyDecoded, 'Star added for test purposes')
})

test('6. /stars/address:[ADDRESS]: returns an array of blocks of the corresponding address', async t => {
  const blocks = await rp(optionsGetBlocksByWallet)
  t.is(blocks[0].body.address, address)
})
