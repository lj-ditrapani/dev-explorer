const getCities = () =>
  $.get('/cities')
    .fail(() => {
      console.log('error: could not get cities data')
    })
    .then(res => filterCities(res.cities))
const getCity = city =>
  $.get(`/city/${city}`).fail(() => {
    console.log('error: could not get city data')
  })
const getUsers = () =>
  $.get(`/users`).fail(() => {
    console.log('error: could not get users data')
  })
const getUser = user =>
  $.get(`/user/${user}`).fail(() => {
    console.log('error: could not get user data')
  })

$(document).ready(() => {
  const googleMap = initMap()
  getCities().then(cities => {
    displayMarkers(googleMap, cities)
    addCities(cities)
  })
  $('.collapsible').collapsible()
  $('#userSearch').on('keypress', onUserSearch)
})

const onUserSearch = e => {
  if (e.which === 13) {
    const name = $('#userSearch').val()
    getUser(name).then(user => {
      const rows = Object.entries(user.languages)
        .sort((a, b) => b[1] - a[1])
        .map(tuple => `<tr><td>${tuple[0]}</td><td>${tuple[1]}</td></tr>`)
      const langs =
        '<table><tr><th>Language</th><th>Bytes</th></tr>' + rows.join('\n') + '</table>'
      const main =
        `<p><img style="width: 125px" src=${user.avatarUrl}> ` +
        `Username: ${user.login} Bytes: ${user.totalSize} ` +
        `<a href="${user.url}">${user.url}</a></p>`
      $('#one-user')
        .empty()
        .append(main + langs)
    })
  }
}

const addCities = cities => {
  cities.forEach(city => {
    $('#city-list').append(
      `<li class="collection-item" id="city-item-${city.location}">
            <div class="collapsible-header">
                <div id="user-name">
                    <p> Location: ${city.location}</p>
                    <p> Users: ${city.numUsers}</p>
                    <p> Top Language: ${city.topLanguage}</p>
                </div>
            </div>

            <div class="collapsible-body">
                <div id="city-body-${city.location}">
                </div>
            </div>
        </li>
            `
    )
    $(`#city-item-${city.location}`).click(e => {
      onCityClick(city.location)
    })
  })
}

const filterCities = cities =>
  cities.filter(c =>
    ['montreal', 'toronto', 'guelph', 'markham', 'kitchener'].includes(c.location)
  )

const locations = ['toronto', 'montreal']

const initMap = () =>
  new google.maps.Map(document.getElementById('google-map'), {
    center: { lat: 43.653, lng: -79.383 },
    zoom: 8
  })

const getLocationsCoords = (googleMap, location, topLanguage, numUsers) => {
  const location2 = location + ', On'
  fetch(
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      location2 +
      '&key=AIzaSyDIugBS6uYAKtUfNwqn7gqL6JnlIpAKeSQ'
  )
    .then(res => res.json())
    .then(json => {
      const infowindow = new google.maps.InfoWindow({
        content:
          '<h6 style="font-weight:bold">' +
          `${location2} ~ ${topLanguage}` +
          `</h6><h6>${numUsers} Users</h6>`
      })

      if (json.results.length > 0) {
        const marker = new google.maps.Marker({
          position: json.results[0].geometry.location,
          map: googleMap,
          animation: google.maps.Animation.DROP
        })
        marker.addListener('click', () => {
          onCityClick(location)
          infowindow.open(googleMap, marker)
        })
      }
    })
    .catch(err => console.error(err))
}

const onCityClick = location => {
  getCity(location).then(city => {
    const cityLangs = $(`#city-body-${location}`)
    const rows = Object.entries(city.languages)
      .sort((a, b) => b[1].numUsers - a[1].numUsers)
      .map(
        entry =>
          `<tr><td> ${entry[0]}</td><td>${entry[1].numUsers}</td><td>${
            entry[1].byteSize
          }</td></tr>`
      )
    cityLangs
      .empty()
      .append(
        '<table><tr><th>language</th><th>Users</th><th>Bytes</th></tr>' +
          rows.join('\n') +
          '</table>'
      )
    const userDiv = $('#city-users')
    const userRows = city.topUsers.map(
      user =>
        `<tr><td><img style="width: 75px" src=${user.avatarUrl}></td><td>${
          user.login
        }</td><td>${user.totalSize}</td><td><a href="${user.url}">${
          user.url
        }</a></td></tr>`
    )
    userDiv
      .empty()
      .append(
        '<table><tr><th>Image</th><th>name</th><th>Bytes</th><th>url</th></tr>' +
          userRows.join('\n') +
          '</table>'
      )
  })
}

const displayMarkers = (googleMap, cities) => {
  cities.forEach(city => {
    getLocationsCoords(googleMap, city.location, city.topLanguage, city.numUsers)
  })
}
