const fetch = require('node-fetch')
const fs = require('file-system')

const parseUsers = () => {
  return (fs.readFileSync('users.json', 'utf8'));
}

arr = []
fetches = []

json = JSON.parse(parseUsers())

console.log(json.users)
// arr = arr.concat((json.users))
console.log(JSON.stringify(json.users))
if (json !== undefined && json.users !== undefined) {
  json.users.forEach(element => {
    arr.push(JSON.stringify(element))
  });
}

for (let i = 1; i <= 10; i++) {
  fetches.push(
    fetch(
      `https://api.github.com/search/users?q=location:Montreal+followers:%3E12&page=${i}&per_page=100`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(res => res.json())
      .then(json => {
        if (json !== undefined && json.items !== undefined) {
          json.items.forEach(element => {
            arr.push(JSON.stringify(element.login))
          })
        }
      })
      .catch(err => console.error(err))
  )
}

Promise.all(fetches).then(function() {
  console.log(arr.length)
  fs.writeFile('users.json', '{"users":[' + arr + ']}', function(err) {})
})
