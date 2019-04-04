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
  const cities = db.collection('cities')
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
  })
  app.get('/cities', getCities(cities))
  app.get('/users', getUsers(users))
  app.get('/city/:name', getCity(cities))
  app.get('/user/:name', getUser(users))
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

const getCities = cities => (req, res) => {
  cities
    .find({})
    .toArray()
    .then(results => {
      const cityData = results.map(r => ({
        location: r.location,
        topLanguage: r.topLanguage,
        numUsers: r.numUsers,
        totalSize: 0
      }))
      res.send({cities: cityData})
    })
}

const getUsers = users => (req, res) => {
  users
    .find({})
    .toArray()
    .then(results => {
      res.send(results.map(r => r.login))
    })
}

const getCity = cities => (req, res) => {
  const cityName = req.params.name
  cities
    .find({ location: cityName })
    .toArray()
    .then(results => {
      if (results.length === 1) {
        res.send(results[0])
      } else {
        res.send({ error: `no city found for ${cityName}` })
      }
    })
}

const getUser = users => (req, res) => {
  const userName = req.params.name
  users
    .find({ login: userName })
    .toArray()
    .then(results => {
      if (results.length === 1) {
        res.send(results[0])
      } else {
        res.send({ error: `no user found for ${userName}` })
      }
    })
}

MongoClient.connect(url)
  .then(setup)
  .catch(e => console.log(e))

app.use(express.static(path.join(__dirname, 'views')))
