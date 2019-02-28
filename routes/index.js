var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const {body, validationResult } = require('express-validator/check');
const yelp = require('yelp-fusion');
const apiKey = 'wGqzd3D0HanzPEzCzsL6564joQ193ruYklVwN3si1zfkH6tQfsUnYHyOaMSmF4Qlz3kcnweFNGRcukXCcuvaJ_9MOw-1PfHc2Ql1BR-hXXv5cevs43CgmZVgiTpxXHYx';
const mongoose = require('mongoose');
var Roaster = require('../models/roasters');
const async = require('async')
var debug = require('debug')('roaster');


var urlencodedParser = bodyParser.urlencoded({ extended: false })

// GET home page.
router.get('/', function(req, res) {
  res.redirect('/catalog');
});

router.post('/search',urlencodedParser, function (req,res,next){

  let inputContent = req.body.textField;
	// console.log(inputContent);

  const searchRequest = {
    term:'Coffee Roasters',
    location: inputContent,
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
        "name" : name.toString(),
        "location" : loc.toString(),
        "coordinates" : coords.toString(),
        "phone" : phone.toString(),
        "distance" : dist.toString()
      }

      var roaster = new Roaster({
        name: result.name,
        address: result.location,
        coords: result.coordinates,
        phone: result.phone,
        dist: result.distance
      });

        roaster.save(function(err) {
          if (err) {  return next(err); }
        });
      }
  })
  res.redirect('/catalog')
})
    // module.exports = mongoose.model(result, SomeModelSchema );

    // results.push(result)
    // console.log(result)


module.exports = router;
