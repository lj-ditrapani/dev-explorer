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
  const users = db.collection('users')
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })
  app.get('/cities', getCities(users))
  app.get('/users', getUsers(users))
  app.get('/city/:name', getCity(users))
  app.get('/user/:name', getUser(users))
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

const getCities = (users) => (req, res) => {
  res.send('Cities!')
}

const getUsers = (users) => (req, res) => {
  res.send('Users!')
}

const getCity = (users) => (req, res) => {
  res.send('City!')
}

const getUser = (users) => (req, res) => {
  res.send('User!')
}

MongoClient.connect(url).then(setup).catch(e => console.log(e))

app.use(express.static(path.join(__dirname, 'build')))
