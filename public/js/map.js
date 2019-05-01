let dataPoints = [];
let ibArray = [];
let center = { lng: -73.97332, lat: 40.685787 };
let items = [];
let markerList = [];

makeMap('googleMap', () => {
  console.log('making map')
})

async function doStuff() {
  console.log('doing stuff')
  const data = await getSomeAsyncData('catalog/projectsJSON')
  console.log('projects', data.projects)
  await addMarkers(data.projects, () => {
  })
  const data2 = await getSomeAsyncData('catalog/wastesJSON')
  console.log('waste', data2.wastes)
  await addMarkers(data2.wastes, () => {
  })
}


function fetchTheData(someValue) {
  return new Promise((resolve, reject) => {
    getData(someValue, (result) => {
      resolve(result);
    })
  });
}

async function getSomeAsyncData(value) {
  const result = await fetchTheData(value);
  return result;
}



function closeBoxes() {
  for (let i = 0; i < ibArray.length; i++) {
    ibArray[i].close();
  }
}

function setMap(coords) {
  console.log('in set map')
  center = new google.maps.LatLng(coords)
  map.panTo(center);
}



function getData(path, callback) {
  console.log('getting data')

  const jSON = $.getJSON(path, (itemList) => {
    dataPoints = itemList.data
    if (dataPoints) {
      dataPoints.forEach(dataPoint => {
        // console.log(dataPoint)
        let lat = dataPoint.coordinates.lat
        let long = dataPoint.coordinates.lng

        // console.log(dataPoint.id)

        let item = {
          id: dataPoint.id,
          name: `${dataPoint.name}`,
          address: `${dataPoint.address}`,
          coordinates: `latitude: ${lat}, longitude: ${long}`,
          phone: `${dataPoint.phone}`,
          distance: `${dataPoint.distance}`,
          coordinatesObj: dataPoint.coordinates
        }
        // const coords = dataPoint.coordinates;
        items.push(item)
        // console.log(item)
      })


    } else {
      console.log('waiting for input')
    }
  })
    .fail(() => {
      console.log("error");
    })
    .always(() => {
      console.log("got data");
      // newCoords(items)
    });
  jSON.done((items) => {
    callback(items)

  });
}

let mapNotSet = true;

function addMarkers(data, callback) {
  console.log('adding', data, 'markers')
  if (data.length === 0) {
    center = { lng: -73.97332, lat: 40.685787 };
    setMap(center)
  } else {
    data.forEach(item => {
      console.log('item:', item)
      // console.log(item.)
      let infoBox;
      if (item.location) {
        if (mapNotSet) {
          setMap(item.location.coordinates)
          mapNotSet = false;
        }
        addMarkerFunctions(item, infoWindow => {
          infoBox = infoWindow
        })

        const marker = new google.maps.Marker({
          position: item.location.coordinates,
          map: map
        });

        marker.addListener('click', () => {
          closeBoxes()
          infoBox.open(map, marker);
        });
      }
    })
  }


  callback(markerList)

}


function addMarkerFunctions(item, callback) {

  let category = ''
  let moment = ''

  if (item.category) {
    category = item.frequency.category
    moment = item.frequency.moment
  }

  // console.log(item)
  const contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    `<a href= '/catalog/user/profile/${item.username}/${item._id}'<h3 id="firstHeading" class="firstHeading">${item.title}</h3></a>` +
    '<div id="bodyContent">' +
    `<p><b>Address:</b> ${item.location.address}` +
    `<p><b>Coordinates:</b> ${item.location.coordinates}` +
    `<p><b>Distance:</b> ${item.material}` +
    `<p><b>Frequency:</b> ${category}, at ${moment}` +
    '</div>' +
    '</div>';

  infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 320
  });
  ibArray.push(infowindow)

  callback(infowindow)
}

function makeMap(id, callback) {
  map = new google.maps.Map(
    document.getElementById(id), {
      zoom: 12,
      center: center,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ]
    });

  google.maps.event.addDomListener(map, 'click', () => {
    closeBoxes()
  });
  google.maps.event.addListenerOnce(map, 'idle', () => {
    console.log('map loaded')
    doStuff()
  })

  // console.log(map)

  callback(map)
}
