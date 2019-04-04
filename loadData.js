const axios = require('axios')
const R = require('ramda')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb://localhost:27017'
const dbName = 'devexplorer'
const usernames = require('./test_users.json')

const getUserRepoDetails = username => {
  return axios
    .post(
      'https://api.github.com/graphql',
      {
        query: `query {
	user(login: "${username}"){
    avatarUrl
    login
    location
    url
    repositories(last: 100){
      nodes{
        name
        languages(last:100){
          totalCount
          totalSize
          nodes{
            name
          }
          edges{
            size
          }
        }
      }
    }
  }
}`
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${process.env.token}`
        }
      }
    )
    .then(response => {
      assert.equal(response.status, 200)
      return response.data
    })
}

const repoReducer = (acc, repo) => {
  const names = repo.languages.nodes.map(n => n.name)
  const sizes = repo.languages.edges.map(e => e.size)
  return {
    totalSize: acc.totalSize + repo.languages.totalSize,
    languages: R.mergeWith((a, b) => a + b, acc.languages, R.zipObj(names, sizes))
  }
}

const transformUser = user => {
  const rawUser = user.data.user
  const init = { totalSize: 0, languages: {} }
  const repoData = rawUser.repositories.nodes.reduce(repoReducer, init)
  return {
    avatarUrl: rawUser.avatarUrl,
    login: rawUser.login,
    location: rawUser.location,
    url: rawUser.url,
    ...repoData
  }
}

const addUser = (user, users) => {
  const newUser = transformUser(user)
  return users.insertOne(newUser)
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
  generateUserData(usernames.users.slice(0, 20), users)
    .then(() => showUsers(users))
    .then(() => client.close())
})

const generateUserData = (usernames, users) => {
  if (usernames.length === 0) {
    return
  } else {
    const username = usernames.pop()
    return getUserRepoDetails(username)
      .then(user => (user.data.user === null ? null : addUser(user, users)))
      .then(() => generateUserData(usernames, users))
  }
}
