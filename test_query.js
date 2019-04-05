const request = require('request-promise-native')
const assert = require('assert')
const githubUserRequest = require('./github_user_request')

githubUserRequest('tobogdan').then(u => {
  console.log(u)
  console.log(u.repositories.nodes[0])
}).catch(e => console.log(e))
