let dataPoints = [];
let center;
let ibArray = [];
let infowindow;
let roasters = [];
let markerList = [];

$(window).load(function(){
  makeMap('map', map => {
    console.log('making map')
  })
})

function doStuff(){
getSomeAsyncData('/data').then(roasters => {
addMarkers(roasters, info_window => {
  console.log(roasters)
})
}).catch(e => {
});
}


function fetchTheData(someValue){
    return new Promise(function(resolve, reject){
        getData(someValue, function(result){
                resolve(result);
        })
    });
}

async function getSomeAsyncData(value){
    const result = await fetchTheData(value);
    return result;
}




function getData(path, callback){
var jSON = $.getJSON(path, function(roasterList) {
  dataPoints = roasterList.data
    if(dataPoints){
        dataPoints.forEach( dataPoint=>{
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
            // var coords = dataPoint.coordinates;
            roasters.push(roaster)
            // console.log(roaster)
      })


    } else {
      console.log('waiting for input')
    }
  })
  .fail(function() {
    console.log( "error" );
  })
  .always(function() {
    console.log( "done" );
    // newCoords(roasters)
  });
jSON.complete(function() {
  callback(roasters)

});
}


function addMarkers(roasters, callback){
  // console.log('roasters' + roasters)
  if(roasters.length == 0 ){
  var nyc = {lng: -73.97332, lat: 40.685787};
  center = nyc
  setMap(center)
} else {
  center = roasters[0].coordinatesObj
  // console.log(center)
  setMap(center)
  roasters.forEach(roaster => {
    var infoBox;
    addMarkerFunctions(roaster, infoWindow => {
      infoBox = infoWindow
    })
  var marker = new google.maps.Marker({
      position: roaster.coordinatesObj,
      map: map
    });

    marker.addListener('click', function() {
        closeBoxes()
        infoBox.open(map, marker);
        });
    })
  }

callback(markerList)

}


function addMarkerFunctions(roaster, callback){

    // console.log(roaster)
    var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            `<a href= '/catalog/roasters/${roaster.id}'<h3 id="firstHeading" class="firstHeading">${roaster.name}</h3></a>`+
            '<div id="bodyContent">'+
            `<p><b>Address:</b> ${roaster.address}` +
            `<p><b>Coordinates:</b> ${roaster.coordinates}` +
            `<p><b>Distance:</b> ${roaster.distance}` +
            `<p><b>Phone:</b> ${roaster.phone}` +
            '</div>'+
            '</div>';

        infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 320
                });
          ibArray.push(infowindow)

  callback(infowindow)
}


function closeBoxes(){
  for (var i = 0; i < ibArray.length; i++ ) {
           ibArray[i].close();
      }
}

function setMap(coords){
  center = new google.maps.LatLng(coords)
  map.panTo(center);
}



function makeMap(id, callback){
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

      google.maps.event.addDomListener(map, 'click', function() {
        closeBoxes()
          });
      google.maps.event.addListenerOnce(map, 'idle', function(){
         console.log('map loaded')
         doStuff()
      })

          callback(map)
    }
