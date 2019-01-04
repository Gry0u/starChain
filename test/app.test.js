const test = require('ava')
<<<<<<< HEAD
// const bluebird = require('bluebird')
||||||| merged common ancestors
const bluebird = require('bluebird')
=======
>>>>>>> 4ebe95bf297c928b256a113e424f34d4a7b78cce
const rp = require('request-promise')
<<<<<<< HEAD
// const fs = bluebird.promisifyAll(require('fs'))
// const supertest = require('supertest')
||||||| merged common ancestors
const fs = bluebird.promisifyAll(require('fs'))
const supertest = require('supertest')
=======
>>>>>>> 4ebe95bf297c928b256a113e424f34d4a7b78cce
const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')
const SERVER_URL = 'http://localhost:8000'
const app = require('../app')
const keyPair = bitcoin.ECPair.makeRandom()
const privateKey = keyPair.privateKey
const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
<<<<<<< HEAD

const optionsRequestValidation = {
  method: 'POST',
  uri: SERVER_URL + '/requestValidation',
  body: {
    address: address
  },
  json: true
}

test.serial('1. /requestValidation: returns a Request JSON object', async t => {
  const requestObject = await rp(optionsRequestValidation)
  t.is(requestObject.address, address)
  t.is(requestObject.validationWindow, 300)
  t.is(requestObject.message, `${address}:${requestObject.requestTimeStamp}:starRegistry`)
||||||| merged common ancestors
fs.writeFileSync('data/address.txt', address)

test.cb('1. /requestValidation: returns a Request JSON object', (t) => {
  supertest(SERVER_URL)
    .post('/requestValidation')
    .send({ address: address })
    .expect(200)
    .expect((response) => {
      t.is(response.status, 200)
      t.is(response.body.address, address)
      t.is(response.body.validationWindow, 300)
      t.hasOwnProperty('requestTimeStamp')
      t.is(response.body.message, `${address}:${response.body.requestTimeStamp}:starRegistry`)

      // write signature into text file for reuse in further tests
      const signature = bitcoinMessage.sign(response.body.message, privateKey, keyPair.compressed).toString('base64')
      fs.writeFileSync('data/signature.txt', signature)
    })
    .end(t.end)
=======
const optionsRequestValidation = {
  method: 'POST',
  uri: SERVER_URL + '/requestValidation',
  body: { address: address },
  json: true
}

const optionsGetBlockByIndex = {
  method: 'GET',
  uri: SERVER_URL + '/block/0'
}

const optionsGetBlocksByWallet = {
  method: 'GET',
  uri: SERVER_URL + '/stars/address:' + address
}

test.serial('1. /requestValidation: returns a Request JSON object', async t => {
  const requestObject = await rp(optionsRequestValidation)
  t.is(requestObject.address, address)
  t.is(requestObject.validationWindow, 300)
  t.is(requestObject.message, `${address}:${requestObject.requestTimeStamp}:starRegistry`)
>>>>>>> 4ebe95bf297c928b256a113e424f34d4a7b78cce
})

<<<<<<< HEAD
test.serial('2. /message-signature/validate: returns a JSON object with registerStar and status properties', async t => {
  const message = (await rp(optionsRequestValidation)).message
  const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')
  const optionsMessageSignature = {
||||||| merged common ancestors
test('2. /message-signature/validate: returns a JSON object with registerStar and status properties', async t => {
  const signature = await fs.readFileAsync('data/signature.txt')
  const options = {
=======
test.serial('2. /message-signature/validate: returns a JSON object with registerStar and status.messageSignature properties true', async t => {
  const message = (await rp(optionsRequestValidation)).message
  const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')
  const optionsMessageSignature = {
>>>>>>> 4ebe95bf297c928b256a113e424f34d4a7b78cce
    method: 'POST',
    uri: SERVER_URL + '/message-signature/validate',
    body: {
      address: address,
<<<<<<< HEAD
      signature: signature
||||||| merged common ancestors
      signature: signature.toString()
=======
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
>>>>>>> 4ebe95bf297c928b256a113e424f34d4a7b78cce
    },
    json: true
  }
<<<<<<< HEAD
  const validRequestObj = await rp(optionsMessageSignature)
  t.true(validRequestObj.registerStar)
  t.is(validRequestObj.status.address, address)
  t.true(validRequestObj.status.messageSignature)
})

test.serial('3. /block: returns boolean describing if address is verified and if a star can be registered', async t => {
  const optionsBlock = {
    method: 'POST',
    uri: SERVER_URL + '/block',
    body: {
      address: address
    },
    json: true
  }
  const request = await rp(optionsBlock)
  t.true(request.messageSignature)
||||||| merged common ancestors
  const response = await rp(options)
  t.true(response.registerStar)
=======
  const starBlock = await rp(optionsAddBlock)
  t.truthy(starBlock.hash)
  t.truthy(starBlock.height)
  t.truthy(starBlock.body.story)
  t.truthy(starBlock.time)
  t.truthy(starBlock.previousBlockHash)
  t.is(starBlock.body.address, address)
})

test.serial('4. /block/[INDEX]: returns block of the corresponding height as JSON object', async t => {
  const block = JSON.parse(await rp(optionsGetBlockByIndex))
  t.is(block.height, 0)
  t.is(block.body, 'Genesis Block')
})

test.serial('5. /stars/hash:[HASH]: returns block of the corresponding hash as JSON object', async t => {
  const hash = JSON.parse(await rp(optionsGetBlockByIndex)).hash
  const optionsGetBlockByHash = {
    method: 'GET',
    uri: SERVER_URL + '/stars/hash:' + hash
  }
  const block = JSON.parse(await rp(optionsGetBlockByHash))
  t.is(block.height, 0)
  t.is(block.body, 'Genesis Block')
})

test('6. /stars/address:[ADDRESS]: returns an array of blocks of the corresponding address', async t => {
  const blocks = JSON.parse(await rp(optionsGetBlocksByWallet))
  t.is(blocks[0].body.address, address)
>>>>>>> 4ebe95bf297c928b256a113e424f34d4a7b78cce
})
