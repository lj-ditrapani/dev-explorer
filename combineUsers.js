const fs = require('file-system')

const parseUsers = file => {
  return fs.readFileSync(`./usersCity/${file}`, 'utf8')
}

arr = []

process.argv.forEach(arg => {
  if (arg.includes('.json')) {
    json = JSON.parse(parseUsers(arg))
    json.users.forEach(element => {
      arr.push(JSON.stringify(element))
    })
  }
})

console.log(arr.length)

fs.writeFile('users.json', '{"users":[' + arr + ']}', function(err) {})
