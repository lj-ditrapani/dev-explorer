// var DATA = require('./constants');

const getCities = () => {
  return $.get('http://localhost:3000/cities')
    .done(cities => {
      console.log('successfully retrieved cities data')
    })
    .fail(function() {
      console.log('error: could not get cities data')
    })
}
const getCity = city => {
  return $.get(`http://localhost:3000/city/${city}`)
    .done(() => {
      console.log('successfully retrieved city data')
    })
    .fail(function() {
      console.log('error: could not get city data')
    })
}
const getUsers = () => {
  return $.get(`http://localhost:3000/users`)
    .done(() => {
      console.log('successfully retrieved users data')
    })
    .fail(function() {
      console.log('error: could not get users data')
    })
}
const getUser = user => {
  return $.get(`http://localhost:3000/user/${user}`)
    .done(res => {
      console.log('successfully retrieved user data')
    })
    .fail(function() {
      console.log('error: could not get user data')
    })
}

$(document).ready(function() {
  console.log('ready!')
  initMap()
  displayMarkers(getCities())
  addCities()
  addUsers()
  $('.collapsible').collapsible()
})

const addCities = e => {
  getCities().done(res => {
      console.log(res)
      getCity(res.cities.map(c => c.location)).done(city => {
          console.log(city)
      })
    res.cities.map(item => {
      $('#poop').append(
        `<li class="collection-item">
            <div class="collapsible-header">
                <div id="user-name">
                    <p> Location: ${item.location}</p>
                    <p> Users: ${item.numUsers}</p>
                    <p> Languages: ${item.language}</p>
                </div>
            </div>

            <div class="collapsible-body">
                <div>
                    <span>
                    <p> Top Uders: ${item.location.location}</p>
                    <p> Lines Written: ${(item.location.language)}</p>
                    </span>
                </div>
            </div>
        </li>
            `
      )
    })
  })
}

const addUsers = () => {
  getUsers().done(res => {
    res.users.forEach(user => {
      getUser(user).then(item => {
        $('#collapsible').append(
          `
                    <li>
                        <div class="collapsible-header">
                        <div id="user-name">
                            <img style="margin-left:35px;width:100px;height:100px" src="${
                              item.avatarUrl
                            }" alt="" class="circle">
                            <h5 class="title">Name: ${item.login}</h5>
                            <a href=${item.url} class="title">Github: ${item.url}</a>
                        </div>
        
                        </div>
                        <div class="collapsible-body">
                        <span id="details-user">
                            <p> LOCATION: ${item.location}</p>
                            <p> LANGUAGES: ${JSON.stringify(item.languages)}</p>
                        </span>
                        </div>
                    </li>
                    `
        )
      })
    })
  })
}

const locations = ['toronto', 'montreal']

var map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 43.653, lng: -79.383 },
    zoom: 8
  })
}

const getLocationsCoords = (location, topLanguage, numUsers) => {
  if (!location.includes(',')) {
    location += ', On'
  }
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyDIugBS6uYAKtUfNwqn7gqL6JnlIpAKeSQ`
  )
    .then(function(res) {
      return res.json()
    })
    .then(function(json) {
      var infowindow = new google.maps.InfoWindow({
        content: `<h6 style="font-weight:bold">${location} ~ ${topLanguage}</h6><h6>${numUsers} Users</h6>`
      })

      var marker = new google.maps.Marker({
        position: json.results[0].geometry.location,
        map: map,
        animation: google.maps.Animation.DROP
      })
      marker.addListener('click', function() {
        infowindow.open(map, marker)
      })
    })
    .catch(err => console.error(err))
}

const displayMarkers = cities => {
  cities.done(res => {
    res.cities.forEach(city => {
      getLocationsCoords(city.location, city.topLanguage, city.numUsers)
    })
  })
}

const deprecated = () => {
  locations.forEach(address => {
    getLocationsCoords(address)
  })
}
