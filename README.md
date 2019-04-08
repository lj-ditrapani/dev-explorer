Evoke 2019 DisruptAI Hackathon
==============================

- Team 9k
- Project: Dev Explorer
- View programming languages ranked by city and developer.


Setup
-----

    docker pull mongo:4.1.9-bionic
    npm install
    docker run --rm -p 27017:27017 --name mongo-9k -v $HOME/mongo-9k:/data/db -d mongo:4.1.9-bionic


Load data
---------

Login to github; goto settings; generate a personal access token.
Write the token to github-token.txt (don't commit this file!).
Then run load_data.js with the token passed as an environment variable.

    token=`cat github-token.txt` node load_data.js

To see the map data, you need a google key.
Login to google maps api and get a javascript maps API key.
Enable the javascript maps API and the geocoding API.
Restrict the key to only use these 2 APIs.
Write it to a file called public/google-maps-key.txt.
You'll need to provide credit card details to google to get the key.


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
cities: [
        {location: montreal, topLang: string, totalSize: num, numUsers: num},
        {location: toronto, topLang: string, totalSize: num, numUsers: num}
        ...
    ]
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
    laguages: { java: {byteSize: number, numUsers: number},
    topLanguage: java,
    numUsers: number,
    topUsers: [{..userData}, {...userData}, ...]
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


Trouble shooting github requests
--------------------------------

```
curl -v --header "Authorization: Bearer `cat github-token.txt`" -X POST --data "@query.json" https://api.github.com/graphql | python -m json.tool
```

    token=`cat github-token.txt` node test_query.js


Screen shots
------------

![Initial view](screen-shots/init.png?raw=true "Initial view")
![Top Developers per City](screen-shots/top-developers.png?raw=true "Top Developers per City")
![Top Languages per City](screen-shots/init.png?raw=true "Top Languages per City")
![Top Languages per Developer](screen-shots/init.png?raw=true "Top Languages per Developer")
