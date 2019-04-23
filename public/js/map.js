let dataPoints = [];
let ibArray = [];
let center = { lng: -73.97332, lat: 40.685787 };
let roasters = [];
let markerList = [];

makeMap('googleMap', () => {
  console.log('making map')
})

async function doStuff() {
  console.log('doing stuff')
  const roasters = await getSomeAsyncData('/data')
  console.log(roasters)
  await addMarkers(roasters, () => {
  }).catch((e) => {
    console.log(e)
  });
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

  const jSON = jquery.getJSON(path, (roasterList) => {
    dataPoints = roasterList.data
    if (dataPoints) {
      dataPoints.forEach(dataPoint => {
        // console.log(dataPoint)
        let lat = dataPoint.coordinates.lat
        let long = dataPoint.coordinates.lng

        // console.log(dataPoint.id)

        let roaster = {
          id: dataPoint.id,
          name: `${dataPoint.name}`,
          address: `${dataPoint.address}`,
          coordinates: `latitude: ${lat}, longitude: ${long}`,
          phone: `${dataPoint.phone}`,
          distance: `${dataPoint.distance}`,
          coordinatesObj: dataPoint.coordinates
        }
        // const coords = dataPoint.coordinates;
        roasters.push(roaster)
        // console.log(roaster)
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
      // newCoords(roasters)
    });
  jSON.done((roasters) => {
    callback(roasters)

  });
}


function addMarkers(roasters, callback) {
  console.log('in addMarkers')
  console.log(roasters.data.length)
  if (roasters.data.length === 0) {
    center = { lng: -73.97332, lat: 40.685787 };
    setMap(center)
  } else {
    center = roasters.data[0].coordinates
    console.log(center)
    setMap(center)
    roasters.data.forEach(roaster => {
      // console.log(roaster)
      // console.log(roaster.)
      let infoBox;
      addMarkerFunctions(roaster, infoWindow => {
        infoBox = infoWindow
      })
      const marker = new google.maps.Marker({
        position: roaster.coordinates,
        map: map
      });

      marker.addListener('click', () => {
        closeBoxes()
        infoBox.open(map, marker);
      });
    })
  }

  callback(markerList)

}


function addMarkerFunctions(roaster, callback) {

  // console.log(roaster)
  const contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    `<a href= '/catalog/roasters/${roaster.id}'<h3 id="firstHeading" class="firstHeading">${roaster.name}</h3></a>` +
    '<div id="bodyContent">' +
    `<p><b>Address:</b> ${roaster.address}` +
    `<p><b>Coordinates:</b> ${roaster.coordinates}` +
    `<p><b>Distance:</b> ${roaster.distance}` +
    `<p><b>Phone:</b> ${roaster.phone}` +
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
