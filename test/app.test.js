const test = require('ava')
const bluebird = require('bluebird')
const rp = require('request-promise')
const fs = bluebird.promisifyAll(require('fs'))
const supertest = require('supertest')
const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')
const SERVER_URL = 'http://localhost:8000'
const app = require('../app')
const keyPair = bitcoin.ECPair.makeRandom()
const privateKey = keyPair.privateKey
const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })

const options1 = {
  method: 'POST',
  uri: SERVER_URL + '/requestValidation',
  body: {
    address: address
  },
  json: true
}

test('1. /requestValidation: returns a Request JSON object', async t => {
  const response = await rp(options1)
  t.is(response.address, address)
  t.is(response.validationWindow, 300)
  t.is(response.message, `${address}:${response.requestTimeStamp}:starRegistry`)
})

test('2. /message-signature/validate: returns a JSON object with registerStar and status properties', async t => {
  // const signature = await fs.readFileAsync('data/signature.txt')

  const message = (await rp(options1)).message
  const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')
  const options2 = {
    method: 'POST',
    uri: SERVER_URL + '/message-signature/validate',
    body: {
      address: address,
      signature: signature
    },
    json: true
  }
  const response2 = await rp(options2)
  t.true(response2.registerStar)
})
