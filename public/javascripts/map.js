$('.my_selector').click(function(){
   $.get('http://localhost:3000/roaster_list', {}, function(data){
        // console.log(data)
   });
});

let dataPoints
let markerPoints = []

var jSON = $.getJSON('/data', function(roasterList) {
  dataPoints = roasterList.data
  dataPoints.forEach( dataPoint=>{
    // console.log(dataPoint.name)
    let roaster = {
        name: `${dataPoint.name}`,
        address: `${dataPoint.address}`,
        coordinates: `${dataPoint.coordinates}`,
        phone: `${dataPoint.phone}`,
        distance: `${dataPoint.distance}`
      }
      var coords = dataPoint.coordinates;
      // console.log(coords)
      markerPoints.push(coords)
      // console.log(coords)
      // let marker = new google.maps.Marker({position: coords, map: map});


      // dataPoints.push(roaster)
      // console.log(roaster)

    })
  })
  .fail(function() {
    console.log( "error" );
  })
  .always(function() {
    console.log( "comp" );
  });

jSON.complete(function() {
  console.log( "lete" );
});


$(window).load(function(){
  // console.log('hello world')

  let center;

  if(markerPoints.length == 0 ){
  var nyc = {lng: -73.97332, lat: 40.685787};
  center = nyc
} else {
  center = markerPoints[0]
  // console.log(markerPoints)
}
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 12, center: center });
  // The marker, positioned at Uluru
  markerPoints.forEach(markerPoint => {
    console.log(markerPoint)
  var marker = new google.maps.Marker({position: markerPoint, map: map});
    })
  // dataPoints = []
  // console.log('adding map')
})


  // mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhc2Fuc2MiLCJhIjoiY2pyd2cyeWduMGNnNzQ5cDk4bHRwYmVxayJ9.sAZTXvzkVOfBdIg3GmFsLQ' // add your own mapbox token to make this example work
  // let map = new mapboxgl.Map({
  //   container: 'mapid',
  //   style: 'https://api.mapbox.com/styles/v1/chasansc/cjstm33jp4vxr1fo6x37sbf3i.html?fresh=true&title=true&access_token=pk.eyJ1IjoiY2hhc2Fuc2MiLCJhIjoiY2pyd2cyeWduMGNnNzQ5cDk4bHRwYmVxayJ9.sAZTXvzkVOfBdIg3GmFsLQ#12.0/48.866500/2.317600/0',
  //   center: [-73.97332, 40.685787],
  //   minZoom: 2,
  //   zoom: 10
  // }, function (map){
  //   $('#mapid').show()
  //
  //   map.resize();
  // })





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
