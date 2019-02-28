function setup(){
  addMap();
}

function addMap() {
  console.log('adding map')
  mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhc2Fuc2MiLCJhIjoiY2pyd2cyeWduMGNnNzQ5cDk4bHRwYmVxayJ9.sAZTXvzkVOfBdIg3GmFsLQ' // add your own mapbox token to make this example work
  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-73.97332, 40.685787],
    minZoom: 2,
    zoom: 10
  })

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
}
