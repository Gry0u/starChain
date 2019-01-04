# Star Notary Service
This Star Notary Service is built on top of the [private blockchain](https://github.com/Gry0u/private_blockchain) I previously created. It include a Web API allowing users to interact with the blockchain and especially claim ownership of their favorite star in the night sky.
### Describe stars: [celestial coordinates](http://cse.ssl.berkeley.edu/SegwayEd/lessons/findplanets/coordinates.html)
Here is an example of how star coordinates are represented:
```
RA 13h 03m 33.35sec, Dec -49° 31’ 38.1” Mag 4.83 Cen
```
- **RA**: Right Ascension
- **Dec**: Declination
- **CEN**: Centaurus
- **MAG**: Magnitude
### Find stars
![Night Sky](https://s2.qwant.com/thumbr/0x0/c/9/1d9dcaa40b24c1cf332f495ec2c7b8beb2e3e3d0e14dba81bd785e5795efd5/2017-11_Pleiades_IMG_2233_trans_NvBQzQNjv4BqW262bfDaLoEAv8fLTItRBhonCgPdlArYFzeg0UkvGYI.png?u=https%3A%2F%2Fwww.telegraph.co.uk%2Fcontent%2Fdam%2Fscience%2F2017%2F11%2F02%2F2017-11_Pleiades_IMG_2233_trans_NvBQzQNjv4BqW262bfDaLoEAv8fLTItRBhonCgPdlArYFzeg0UkvGYI.png%3Fimwidth%3D450&q=0&b=1&p=0&a=1)
- [Google Sky](https://www.google.com/sky/)
- [Sky Map](https://in-the-sky.org/skymap.php)
## Project architecture and files
![Sequence Diagram](https://s3.amazonaws.com/video.udacity-data.com/topher/2018/November/5be355bb_project4-workflow/project4-workflow.png)
- **Web API**: Defines API endpoints' routes and handlers.
  - *BlockController.js*
- **Mempool**: to manage validation requests to grant users the right to register a star.
  - *MemPool.js*
  - *Request.js*
- **Blockchain**: to store and persist star blocks
  - *Blockchain.js*
  - *LevelDB.js*
  - *Block.js*
## Getting Started
1. Download or clone the repository
2. Install project dependencies: `npm install`
3. Start the web service: `node app.js`

## Web API
The server runs locally by default on port 8000.  
You may select a different one by updating the `PORT` parameter of the **BlockAPI** constructor in [app.js](app.js).
### Submit a validation request
First the user needs to request validation of their wallet address before being able to register any stars.
**METHOD**: POST  
**URL**: `/requestValidation`  
**Parameter**  
- `address`: user's wallet address  

**RESPONSE**
```
{
    "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "requestTimeStamp": "1541605128",
    "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
    "validationWindow": 300
}
```
### Prove ownership of wallet
After submitting a validation request, the user needs to prove that he is the owner of the considered address by providing the signature of the message returned in the previous step.
**METHOD**: POST  
**URL**: `/message-signature/validate`  
**Parameters**  
- `address`
- `signature`

**RESPONSE**
```
{
  "registerStar": true,
  "status": {
    "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "requestTimeStamp": "1541605128",
    "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
    "validationWindow": 200,
    "messageSignature": true
  }
}
```
### Register star
After validation of the signature, the user can now register a star.
**METHOD**: POST  
**URL**: `/block`  
**Parameters**  
- `address`
- `star`:  
```
{
  "dec": "68° 52' 56.9",
  "ra": "16h 29m 1.0s",
  "story": "Found star using https://www.google.com/sky/"
}
```

**RESPONSE**
```
{
 "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```
### Retrieve stars
#### By height
**METHOD**: GET  
**URL**: `/block/[HEIGHT]`  
#### By hash
**METHOD**: GET  
**URL**: `/stars/[HASH]`  
#### By wallet address
**METHOD**: GET  
**URL**: `/stars/[ADDRESS]`  



## Resources
- [LevelDB](http://leveldb.org/) to persist the data
- [Node.js](https://nodejs.org/en/)
- [hapijs](https://hapijs.com/) framework to build API web service
- [crypto-js](https://www.npmjs.com/package/crypto-js) for SHA256 cryptographic function
- [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) & [bitcoinjs-message](https://github.com/bitcoinjs/bitcoinjs-message): bitcoin javascript libraries
