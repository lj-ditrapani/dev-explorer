const R = require('ramda')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb://localhost:27017'
const dbName = 'devexplorer'

const user = require('./test_data/userData')

const repoReducer = (acc, repo) => {
  const names = repo.languages.nodes.map(n => n.name)
  const sizes = repo.languages.edges.map(e => e.size)
  return R.zipObj(names, sizes)
}

const transformUser = user => {
  const rawUser = user.data.user
  const languages = rawUser.repositories.nodes.reduce(repoReducer, {})
  return {
    login: rawUser.login,
    location: rawUser.location,
    languages
  }
}

const addUser = (user, users) => {
  const newUser = transformUser(user)
  return users.insert(newUser)
}

const showUsers = users =>
  users
    .find({})
    .toArray()
    .then(docs => {
      console.log('Found the following records')
      console.log(docs)
    })

MongoClient.connect(url).then(client => {
  console.log('Connected to mongodb')
  const db = client.db(dbName)
  const users = db.collection('users')
  addUser(user, users)
    .then(() => showUsers(users))
    .then(() => client.close())
})
