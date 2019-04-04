// var DATA = require('./constants');

const cities = [
  {
    name: 'Toronto',
    language: 'Hi',
    numberOfUser: 0
  },
  {
    name: 'Montreal',
    language: 'Hi',
    numberOfUser: 0
  },
  {
    name: 'Waterloo',
    language: 'Hi',
    numberOfUser: 0
  }
]

const languages = [
  {
    name: 'Java',
    img: 'http://www.sclance.com/pngs/java-png/java_png_728079.png'
  },
  {
    name: 'JavaScript',
    img:
      'https://banner2.kisspng.com/20180810/fvl/kisspng-javascript-comment-html-logo-international-confere-amp-quot-need-page-amp-quot-5b6d61dfbbdf29.2420070415338951357695.jpg'
  },
  {
    name: 'Python',
    img: 'https://pluralsight.imgix.net/paths/python-7be70baaac.png'
  },
  {
    name: 'CSS',
    img: 'https://cdn-images-1.medium.com/max/1200/1*eXIBeNlLhz4Pe6vDrYkXLQ.png'
  },
  {
    name: 'HTML',
    img: 'https://ya-webdesign.com/images/svg-sites-html-5.png'
  },
  {
    name: 'SHELL',
    img: 'http://www.stickpng.com/assets/images/5954be4edeaf2c03413be356.png'
  },
  {
    name: 'C++',
    img: 'https://raw.githubusercontent.com/isocpp/logos/master/cpp_logo.png'
  },
  {
    name: 'C',
    img:
      'https://seeklogo.com/images/C/c-programming-language-logo-9B32D017B1-seeklogo.com.png'
  }
]
const citiesData = [
  {
    topLanguage: 'Java',
    users: 1000,
    bitSize: 6969696
  },
  {
    topLanguage: 'Java',
    users: 1000,
    bitSize: 6969696
  },
  {
    topLanguage: 'Java',
    users: 1000,
    bitSize: 6969696
  },
  {
    topLanguage: 'Java',
    users: 1000,
    bitSize: 6969696
  },
  {
    topLanguage: 'Java',
    users: 1000,
    bitSize: 6969696
  }
]
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
    .done((res) => {
      console.log('successfully retrieved user data')
    })
    .fail(function() {
      console.log('error: could not get user data')
    })
}

const mapLanguGeImgs = () => {
  citiesData.map(i => {
    languages.map(j => {
      if (i.topLanguage === j.name) {
        i.img = j.img
      }
    })
  })
}

$(document).ready(function() {
  console.log('ready!')
  initMap()
  displayMarkers(cities)
  addCities()
  addUsers()
  mapLanguGeImgs()
  $('.collapsible').collapsible()
})

const addCities = e => {
  cities.map(item => {
    $('#cities').append(
      `<li class="collection-item">${item.name}</li>
            <li class="collection-item">${item.numberOfUser}</li>
            <li class="collection-item">${item.language}</li>
            `
    )
  })
}

const addUsers = () => {
  getUsers().done(res => {
      console.log(res)
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
      location+=(', On')
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

const users = [
  
]

const displayMarkers = (cities) => {
  cities.forEach(city => {
    getLocationsCoords(city.name, city.language, city.numberOfUser)
  })
}

const deprecated = () => {
  locations.forEach(address => {
    getLocationsCoords(address)
  })
}
