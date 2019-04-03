const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb://localhost:27017'
const dbName = 'devexplorer'

const work = client => {
  const db = client.db(dbName)
  const collection = db.collection('users');
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ]).then(result => {
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    return collection.find({}).toArray()
  }).then((docs) => {
    console.log("Found the following records");
    console.log(docs)
    return collection.find({'a': 3}).toArray()
  }).then((docs) => {
    console.log("Found the following records");
    console.log(docs);
    client.close()
  });
}

MongoClient.connect(url)
  .then(client => {
    console.log('Connected to mongodb')
    return client
  })
  .then(work)
