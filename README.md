Evoke 2019 DisruptAI Team 9k
============================

Setup
-----

    docker pull mongo:4.1.9-bionic
    npm install
    docker run --rm -p 27017:27017 --name mongo-9k -v /$HOME/mongo-9k:/data/db -d mongo:4.1.9-bionic


Run
---
    
    npm start

Go to localhost:3000 in browser


Formatting
----------

Fix your crappy formatting

    npm run fmt
