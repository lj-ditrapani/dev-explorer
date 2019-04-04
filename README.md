Evoke 2019 DisruptAI Team 9k
============================

Setup
-----

    docker pull mongo:4.1.9-bionic
    npm install
    docker run --rm -p 27017:27017 --name mongo-9k -v $HOME/mongo-9k:/data/db -d mongo:4.1.9-bionic


Load data
---------

Login to github; goto settings; generate a personal access token.
Pass the token as environment variable token:

    token=XXX node load_data.js


Run
---
    
    npm start

Go to localhost:3000 in browser


Dev
---
    
    npm run dev

Go to localhost:3000 in browser

Drop mongo db database

    node dropdb.js


Formatting
----------

Fix your crappy formatting

    npm run fmt


Endpoints
---------
/cities -> city names
/users -> user names
/user/:name -> data for user
/city/:name -> data for city

Response Format
---------------

/cities
```
{
    montreal: {topLang: string, totalSize: num, numUsers: num},
    toronto: {topLang: string, totalSize: num, numUsers: num}
    ...
}
```

/users
```
{
    users: [login1, login2, ...]
}
```

/city/:name
```
{
    location: toronto,
    laguages: { java: {byteSize: num, numUsers: num},
    topLanguage: java,
    numUsers: num,
    topUsers: [{..userData}, {...userData}, {}]
}
```

/user/:name
```
{
    "avatarUrl": "https://avatars3.githubusercontent.com/u/37006818?v=4",
    "languages": {
        "Batchfile": 266,
        "C#": 661617,
        "C++": 473464,
        "HTML": 161877,
        "M": 353,
        "MATLAB": 124677,
        "Python": 539344,
        "QMake": 1087,
        "Visual Basic": 438954
    },
    "location": "Montreal, Canada",
    "login": "RoboDK",
    "totalSize": 2401639,
    "url": "https://github.com/RoboDK"
}
```


Ideas
-----

    loadData.js: load data
    index.js: actually run express server (readonly)
              queries mongodb

put index on city
