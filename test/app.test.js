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
})

test('2. /message-signature/validate: returns a JSON object with registerStar and status properties', async t => {
  const signature = await fs.readFileAsync('data/signature.txt')
  const options = {
    method: 'POST',
    uri: SERVER_URL + '/message-signature/validate',
    body: {
      address: address,
      signature: signature.toString()
    },
    json: true
  }
  const response = await rp(options)
  t.true(response.registerStar)
})
