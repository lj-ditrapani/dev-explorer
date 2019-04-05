const request = require('request-promise-native')
const assert = require('assert')

const getUserRepoDetails = username => {
  return request(
    {
      uri: 'https://api.github.com/graphql',
      body: {
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
      method: 'POST',
      json: true,
      headers: {
          'User-Agent': 'dev-explorer',
          'Content-Type': 'application/json',
          Authorization: `bearer ${process.env.token}`
      }
    })
    .then(response => {
      return response.data.user
    })
}

getUserRepoDetails('tobogdan').then(u => {
  console.log(u)
  console.log(u.repositories.nodes[0])
}).catch(e => console.log(e))
