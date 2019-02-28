'use strict';

// const fs = require('fs');
// const archive = path.join(__dirname, 'static');

//
const searchRequest = {
  term:'Coffee Roasters',
  location: '101 lenox rd',
  limit: 50
};

const client = yelp.client(apiKey);

let result = {};
let results = [];

client.search(searchRequest).then(response => {
  const keys = Object.keys(response.jsonBody.businesses)
  for (let i = 0; i < keys.length; i++){
  const name = response.jsonBody.businesses[i].name;
  const phone = response.jsonBody.businesses[i].phone;
  const loc = response.jsonBody.businesses[i].location;
  const coords = response.jsonBody.businesses[i].coordinates;
  const dist = response.jsonBody.businesses[i].distance;


  result = {
    "name" : name,
    "location" : loc,
    "coordinates" : coords,
    "phone" : phone,
    "distance" : dist
  }
  // module.exports = mongoose.model(result, SomeModelSchema );

  results.push(result)
}

}).catch(e => {
  console.log(e);
});

console.log(results)
