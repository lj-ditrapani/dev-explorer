const express = require('express')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const path = require('path');

const app = express()
const port = 3000

const url = 'mongodb://localhost:27017'
const dbName = 'devexplorer'

MongoClient.connect(url, (err, client) => {
  assert.equal(null, err)
  console.log('Connected to mongodb')
  setup(client)
})

app.use(express.static(path.join(__dirname, 'build')));




const setup = client => {
  const db = client.db(dbName)
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
