const fetch = require('node-fetch')
const fs = require('file-system')

arr = []

fetch('https://api.github.com/search/users?q=location:toronto+followers:%3E204&page=1&per_page=100', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json())
  .then(json => {
    json.items.forEach(element => {
      arr.push(JSON.stringify(element.login))
    })
    console.log(arr)
    fs.writeFile('users.json', '{\"users\":[' + arr + ']}', function(err) {})
  })
  .catch(err => console.error(err))
