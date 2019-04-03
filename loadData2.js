const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb://localhost:27017'
const dbName = 'devexplorer'

const user = require('./test_data/userData')

const transformUser = user => {
  const rawUser = user.data.user
  const repos = user.repositories
  return {
    login: rawUser.login,
    location: rawUser.location
  }
}

const addUser = (user, users) => {
  const newUser = transformUser(user)
  return users.insert(newUser)
}

const showUsers = users =>
  users.find({}).toArray().then(docs => {
    console.log('Found the following records')
    console.log(docs)
  })

MongoClient.connect(url)
  .then(client => {
    console.log('Connected to mongodb')
    const db = client.db(dbName)
    const users = db.collection('users')
    addUser(user, users)
      .then(() => showUsers(users))
      .then(() => client.close())
  })
