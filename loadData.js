const axios = require('axios')

axios
  .post(
    'https://api.github.com/graphql',
    {
      query: `query {viewer {login}}`
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${process.env.token}`
      }
    }
  )
  .then(res => {
    console.log('success: ', res.data)
  })
  .catch(err => {
    console.log('error: ', err)
  })
