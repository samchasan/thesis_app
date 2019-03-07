$('.my_selector').click(function(){
   $.get('http://localhost:3000/roaster_list', {}, function(data){
        console.log(data)
   });
});

let dataPoints = [];
let markerPoints = [];
let center;


$(window).load(function(){
  map = new google.maps.Map(
      document.getElementById('map'), {zoom: 12, center: center });
      addCoords()
})

function addCoords(){
var jSON = $.getJSON('/data', function(roasterList) {
  dataPoints = roasterList.data

    if(dataPoints){
        dataPoints.forEach( dataPoint=>{
          console.log(dataPoint.coordinates)
          // let lat = dataPoint.coordinates.lat



          let roaster = {
              name: `${dataPoint.name}`,
              address: `${dataPoint.address}`,
              coordinates: `${dataPoint.coordinates}`,
              phone: `${dataPoint.phone}`,
              distance: `${dataPoint.distance}`
            }
            var coords = dataPoint.coordinates;
            markerPoints.push(coords)
            // console.log("markerpoints:" + markerPoints)
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
  });
jSON.complete(function() {
  newCoords(markerPoints)
  // console.log(markerPoints)
});
}


function newCoords(markerPoints){
  if(markerPoints.length == 0 ){
  var nyc = {lng: -73.97332, lat: 40.685787};
  center = nyc
  setMap(center)
} else {
  center = markerPoints[0]
  // console.log(center)
  setMap(center)
  markerPoints.forEach(markerPoint => {
  // console.log(markerPoint)
  var marker = new google.maps.Marker({position: markerPoint, map: map});
    })
  }
}

function setMap(coords){
  center = new google.maps.LatLng(coords)
  map.panTo(center);
}




  // rawData = [];
  // roasters = []

  // map.on('load', () => {
  //
  //   // you can use data directly from nyc open data without downloading the file, just specify their api endpoint
  //   d3.json('data/roasters.json').then(d => {
  //     rawData = d;
  //
  //     // get the data into a format we can map -- geojson!
  //     rawData.forEach(d => {
  //       let lat = d.lat;
  //       let lng = d.lng;
  //       let name = d.biz_name;
  //       let address = d.address;
  //       if (d.phone) {
  //         let phone = d.phone;
  //       }
  //       // create the popup
  //       var popup = new mapboxgl.Popup({
  //           offset: 25
  //         })
  //         .setText(`${name}, ${address}`);
  //
  //       // create DOM element for the marker
  //       var el = document.createElement('div');
  //       el.id = 'marker';
  //
  //       var marker = new mapboxgl.Marker()
  //         .setLngLat([lng, lat])
  //         .setPopup(popup)
  //         .addTo(map);
  //     })
  //   })
  // })
// }
