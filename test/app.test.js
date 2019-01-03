const test = require('ava')
const supertest = require('supertest')
const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')
const fs = require('fs');
const SERVER_URL = 'http://localhost:8000'
const app = require('../app')
const keyPair = bitcoin.ECPair.makeRandom()
const privateKey = keyPair.privateKey
const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })

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

      // const message = response.body.message
      // const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')
      //
      // fs.writeFileSync('./data/signature.txt', signature)
    })
    .end(t.end)
})
