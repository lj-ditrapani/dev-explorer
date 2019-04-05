const axios = require('axios')

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

getUserRepoDetails('lj-ditrapani').then(u => console.log(u)).catch(e => console.log(e))
