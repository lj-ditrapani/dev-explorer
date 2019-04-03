const axios = require('axios')

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
        languages(last:5){
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

module.exports = getUserRepoDetails
