const test = require('ava')
// const bluebird = require('bluebird')
const rp = require('request-promise')
// const fs = bluebird.promisifyAll(require('fs'))
// const supertest = require('supertest')
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
  body: {
    address: address
  },
  json: true
}

test('1. /requestValidation: returns a Request JSON object', async t => {
  const requestObject = await rp(optionsRequestValidation)
  t.is(requestObject.address, address)
  t.is(requestObject.validationWindow, 300)
  t.is(requestObject.message, `${address}:${requestObject.requestTimeStamp}:starRegistry`)
})

test('2. /message-signature/validate: returns a JSON object with registerStar and status properties', async t => {
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
  t.is(validRequestObj.status.address, address)
  t.true(validRequestObj.status.messageSignature)
})
