const axios = require('axios')
const R = require('ramda')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb://localhost:27017'
const dbName = 'devexplorer'
const usernames = require('./test_users_small.json')

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

const addUser = (user, users, cities) => {
  const newUser = transformUser(user)
  updateCities(newUser, cities)
  return users.insertOne(newUser)
}

const updateCities = (user, cities) => {
  const data = {
    location: user.location,
    languages: R.map(byteSize => ({ byteSize, numUsers: 1 }), user.languages),
    numUsers: 1,
    topUsers: [user]
  }
  const original = cities[user.location]
  if (original === undefined) {
    cities[user.location] = data
  } else {
    const topUsers = original.topUsers
      .concat(data.topUsers)
      .sort((a, b) => b.totalSize - a.totalSize)
      .slice(0, 10)
    const langMerge = (a, b) => ({
      byteSize: a.byteSize + b.byteSize,
      numUsers: a.numUsers + b.numUsers
    })
    const languages = R.mergeWith(langMerge, original.languages, data.languages)
    cities[user.location] = {
      location: original.location,
      numUsers: original.numUsers + data.numUsers,
      languages,
      topUsers
    }
  }
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
  const cities = db.collection('cities')
  generateUserData(usernames.users, users, {})
    .then(insertCities(cities))
    .then(() => showUsers(users))
    .then(() => client.close())
})

const insertCities = cities => cityData => {
  Object.values(cityData).forEach(city => {
    const langTuple = Object.entries(city.languages).sort(
      (a, b) => b[1].numUsers - a[1].numUsers
    )[0]
    const totalSize = Object.values(city.languages).reduce(
      (acc, lang) => acc + lang.byteSize,
      0
    )
    city.topLanguage = langTuple[0]
    city.totalSize = totalSize
  })
  return cities.insertMany(Object.values(cityData))
}

const generateUserData = (usernames, users, cities) => {
  if (usernames.length === 0) {
    return cities
  } else {
    const username = usernames.pop()
    console.log(`Fetching user data for ${username}`)
    return getUserRepoDetails(username)
      .then(user => (user.data.user === null ? null : addUser(user, users, cities)))
      .then(() => generateUserData(usernames, users, cities))
  }
}
