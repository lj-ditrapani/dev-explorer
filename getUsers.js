const fetch = require('node-fetch')
const fs = require('file-system')

const parseUsers = () => {
  return fs.readFileSync('users.json', 'utf8')
}

arr = []
fetches = []

const location = process.argv[2]

if (location) {
  for (let i = 1; i <= 10; i++) {
    fetches.push(
      fetch(
        `https://api.github.com/search/users?q=location:${location}&page=${i}&per_page=100&sort:followers`,
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
    fs.writeFile(`./usersCity/${location}.json`, '{"users":[' + arr + ']}', function(
      err
    ) {})
  })
} else {
  console.log('Provide a location in the cmd line args')
}
