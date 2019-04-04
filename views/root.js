// var DATA = require('./constants');

const cities = [
    { 
        name: 'Hi',
        language: 'Hi',
        numberOfUser: 0
    },
    { 
        name: 'Hi',
        language: 'Hi',
        numberOfUser: 0
    },
    { 
        name: 'Hi',
        language: 'Hi',
        numberOfUser: 0
    },
]

const languages = [
    {
        name: 'Java',
        img: 'http://www.sclance.com/pngs/java-png/java_png_728079.png'
    },
    {
        name: 'JavaScript',
        img: 'https://banner2.kisspng.com/20180810/fvl/kisspng-javascript-comment-html-logo-international-confere-amp-quot-need-page-amp-quot-5b6d61dfbbdf29.2420070415338951357695.jpg'
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
        img: 'https://seeklogo.com/images/C/c-programming-language-logo-9B32D017B1-seeklogo.com.png'
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

const mapLanguGeImgs = () => {
    citiesData.map( i => {
        languages.map( j => {
            if (i.topLanguage === j.name ) {
                i.img = j.img
            }
        })
    })
}

$( document ).ready(function() {
    console.log( "ready!" );
    initMap()
    displayMarkers()
    
    addCities()
    mapLanguGeImgs()
    $('.collapsible').collapsible();
    addLanguages()
});


const addCities = (e) => {
    cities.map(item => {
        $('#cities').append(
            `<li class="collection-item">${item.name}</li>
            <li class="collection-item">${item.numberOfUser}</li>
            <li class="collection-item">${item.language}</li>
            `
        )
    })
}

const addLanguages = () => {
    citiesData.map(item => {
    $('#poop').append(
        `<tr>
            <img src=${item.img}</img>
            <td>${item.topLanguage}
            </td>
            <td>${item.users}</td>
            <td>${item.bitSize}</td>
        </tr>`
    )
})

    console.log(citiesData)

}
  
  const locations = ['toronto', 'montreal']
  
  var map
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 43.653, lng: -79.383 },
      zoom: 8
    })
  }
  
  const getLocationsCoords = location => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyDIugBS6uYAKtUfNwqn7gqL6JnlIpAKeSQ`
    )
      .then(function(res) {
        return res.json()
      })
      .then(function(json) {
          console.log(json.results[0].geometry.location)
        var marker = new google.maps.Marker({
          position: json.results[0].geometry.location,
          map: map,
          label: {
            color: 'black',
            fontWeight: 'bold',
            text: 'LANG'
          },
          icon: {
            labelOrigin: new google.maps.Point(11, 50),
            size: new google.maps.Size(22, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(11, 40)
          }
        })
      })
      .catch(err => console.error(err))
  }
  
  const displayMarkers = () => {
    locations.forEach(address => {
      getLocationsCoords(address)
    })
  }
  