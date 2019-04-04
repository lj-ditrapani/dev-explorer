$(document).ready(function() {
  initMap()
  displayMarkers()
})

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
