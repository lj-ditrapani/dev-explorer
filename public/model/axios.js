const axios = require('axios')
var fs = require('fs');
// const user = 'billwu99'
let data;

let person = {
    login : '',
    avatar: '',
    // repos : [],
    location : null
}
let state = []
let repo_detail = {
    name: '',
    languages: []
}
axios.get(`https://api.github.com/users`)
    .then( res => {
        data = res
        // axios.get(`https://api.github.com/users/${data.login}/repos`).then( i => {
        //     i.data
        // })
        state.push((res.data.map(item=>{
                person = {
                    login: item.login,
                    avatar: item.avatar,
                    location: item.location
                }
            })) 
        )
        fs.readFile('users.json', () => {
            console.log('stuff written')
        })
    })
    .catch(err => {
        console.log(err)
    })