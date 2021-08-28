const searchBtn = document.querySelector('#search-btn');
const currentLoc = document.querySelector('#start');
const destinationLoc = document.querySelector('#end');
const redirectBtn = document.querySelector('#redirect-btn');

const outputDist = document.querySelector('#output .distance');
const outputDur = document.querySelector('#output .duration');
const outputPrice = document.querySelector('#output .price');

let currentLongLat;
let distance;
let duration;
let startAddress,
  endAddress = '',
  currentAddress;
let startID, endID;
let startLat, startLong, endLat, endLong;

searchBtn.addEventListener('click', getLocation);
redirectBtn.addEventListener('click', redirectSite);

function redirectSite() {
  window.open(
    `http://maps.google.com/maps?saddr=${startLat},${startLong}&daddr=${endLat},${endLong}`,
    '_blank'
  );
}

function geocodeAddress(address) {
  const geocoder = new google.maps.Geocoder();

  geocoder
    .geocode({ address: address })
    .then(({ results }) => {
      console.log(results[0].geometry.location);
    })
    .catch((e) =>
      alert('Geocode was not successful for the following reason: ' + e)
    );
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService
    .route({
      origin: {
        query: startAddress,
      },
      destination: {
        query: endAddress,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert('Directions request failed due to ' + status));
}
function showAndRender() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: { lat: 28.7041, lng: 77.1025 },
  });
  directionsRenderer.setMap(map);

  directionsRenderer.setPanel(document.getElementById('sidebar'));
  const control = document.getElementById('floating-panel');
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  currentAddress = startAddress;
  calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function getLocation(e) {
  e.preventDefault();
  const service = new google.maps.DistanceMatrixService();

  const request = {
    origins: [startAddress],
    destinations: [endAddress],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };
  service.getDistanceMatrix(request).then((response) => {
    outputDist.innerHTML =
      (response.rows[0].elements[0].distance.value / 1000).toFixed(2) + ' km';
    outputDur.innerHTML = response.rows[0].elements[0].duration.text;
    outputPrice.innerHTML =
      'Rs. ' +
      (response.rows[0].elements[0].distance.value / 1000).toFixed(2) * 20;
    console.log(
      (response.rows[0].elements[0].distance.value / 1000).toFixed(2) * 20
    );
  });
  showAndRender();
}

// setInterval(() => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const pos = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       };
//       // console.log(pos);
//       currentLongLat = pos;
//     });
//   }

//   if (endAddress.length > 0) {
//     const directionsService = new google.maps.DirectionsService();
//     const directionsRenderer = new google.maps.DirectionsRenderer();
//     const map = new google.maps.Map(document.getElementById('map'), {
//       zoom: 7,
//       center: currentLongLat,
//     });
//     directionsRenderer.setMap(map);

//     currentAddress = '';
//     calculateAndDisplayRoute(directionsService, directionsRenderer);
//   }
// }, 5000);

async function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: { lat: 28.7041, lng: 77.1025 },
  });
  const input1 = document.getElementById('start');
  const input2 = document.getElementById('end');

  const searchBox1 = new google.maps.places.SearchBox(input1);
  const searchBox2 = new google.maps.places.SearchBox(input2);

  searchBox1.addListener('places_changed', () => {
    const places = searchBox1.getPlaces();
    // console.log(places);

    startAddress = places[0].formatted_address;
    // geocodeAddress(startAddress);
    startID = places[0].place_id;
    console.log(startAddress);
    // console.log(places[0].geometry.location.lat());
    startLat = places[0].geometry.location.lat();
    startLong = places[0].geometry.location.lng();

    console.log(startLat, startLong);

    if (places.length == 0) {
      return;
    }
  });

  searchBox2.addListener('places_changed', () => {
    const places = searchBox2.getPlaces();
    // console.log(places);

    endAddress = places[0].formatted_address;
    // geocodeAddress(endAddress);

    endID = places[0].place_id;
    console.log(endAddress);

    endLat = places[0].geometry.location.lat();
    endLong = places[0].geometry.location.lng();
    console.log(endLat, endLong);

    if (places.length == 0) {
      return;
    }
  });
}
