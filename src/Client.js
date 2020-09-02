// require('dotenv').config()
// require('module-alias/register')

const PORT = process.env.PORT || 5000
const express = require('express')
const app = express()

app
  .get('/', (_, res) => res.sendStatus(200))
  .listen(PORT, () => console.log('Server is running s on port: ' + PORT))

const LilirucaClient = require('./client/LilirucaClient')
const client = new LilirucaClient()

client.login(process.env.TOKEN_DISCORD)
