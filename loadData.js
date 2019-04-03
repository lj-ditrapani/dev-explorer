const axios = require('axios')

axios
  .post(
    'https://api.github.com/graphql',
    {
      query: `query {
  rateLimit{
    limit
    cost
    remaining
    resetAt
  }
	viewer{
    location
    repositories(first: 100){
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
  .then(res => {
    console.log('success: ', JSON.stringify(res.data, null, 2))
  })
  .catch(err => {
    console.log('error: ', err)
  })
