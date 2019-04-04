const express = require('express')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const path = require('path')

const app = express()
const port = 3000

const url = 'mongodb://localhost:27017'
const dbName = 'devexplorer'

const setup = client => {
  console.log('Connected to mongodb')
  const db = client.db(dbName)
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })
  app.get('/data', getData)
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

const getData = (req, res) => {
  res.send('No you!')
}

MongoClient.connect(url).then(setup).catch(e => console.log(e))

app.use(express.static(path.join(__dirname, 'build')))
