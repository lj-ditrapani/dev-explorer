const express = require('express')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const app = express()
const port = 3000

const url = 'mongodb://localhost:27017'
const dbName = 'devexplorer'

MongoClient.connect(url, (err, client) => {
  assert.equal(null, err)
  console.log('Connected to mongodb')
  setup(client)
})

const setup = client => {
  const db = client.db(dbName)
  app.get('/', (req, res) => 
    res.sendFile(__dirname +'/views/index.html'))
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
