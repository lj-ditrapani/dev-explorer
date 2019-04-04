const axios = require('axios')
var fs = require('fs')
let user = 'billwu99'
axios
  .get(`https://api.github.com/users/${user}/repos`)
  .then(res => {
    fs.writeFile('repos.json', JSON.stringify(res.data, null, 2), error => {
      console.log(error)
    })
  })
  .catch(err => {
    console.log(err)
  })
