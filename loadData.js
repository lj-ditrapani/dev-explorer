const axios = require('axios')
const R = require('ramda')
const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'
const dbName = 'devexplorer'

const getUserRepoDetails = username => {
  return axios.post(
    'https://api.github.com/graphql',
    {
      query: `query {
	user(login: ${username}){
    login
    location
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
}

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
  getUserRepoDetails('billwu99')
    .then(user => addUser(user, users))
    .then(() => showUsers(users))
    .then(() => client.close())
})
