const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'
const dbName = 'devexplorer'

MongoClient.connect(url).then(client => {
  console.log('Connected to mongodb')
  const db = client.db(dbName)
  db.dropDatabase().then(() => client.close())
})
