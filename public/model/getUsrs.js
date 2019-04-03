const axios = require('axios')
var fs = require('fs');

axios.get(`https://api.github.com/users`)
    .then( res => {
        fs.writeFile("users.json", JSON.stringify(res.data, null ,2 ) , (error) => {
            console.log(error)
        });
    })
    .catch(err => {
        console.log(err)
    })

