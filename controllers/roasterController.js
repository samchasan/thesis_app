require('dotenv').config();
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const async = require('async')
const debug = require('debug')('roaster');
const Roaster = require('../models/roasters');
const bodyParser = require('body-parser');
const yelp = require('yelp-fusion');
const yelpToken = process.env.Yelp;
const googI = process.env.GoogleToken;
const googleToken = 'https://maps.googleapis.com/maps/api/js?key=' + googI;
const mongoose = require('mongoose');
const math = require('mathjs');
const phoneParser = require('libphonenumber-js');
let rawPhone = "0000000000"
const uuid = require('uuid/v4')
const uniqueID = uuid()
const passport = require('passport');
const session = require('express-session')
const urlencodedParser = bodyParser.urlencoded({ extended: false })



console.log('roaster controller: ' + uniqueID)
// timeout in milliseconds
const timeout = 2 * 60 * 1000
let dataArray;

// Display list of all Roasters.
exports.data = (req, res, next) => {
  Roaster.find({ 'userID': uniqueID })
    // .sort([['name', 'ascending']])
    .exec((err, list_roasters) => {
      if (err) { return next(err) }

      list_roasters.forEach((roaster) => {
        console.log(roaster.id)
        // console.log(roaster._id)
        const entry = {
          id: roaster.id,
          name: roaster.name,
          address: roaster.address,
          coordinates: roaster.coordinates,
          phone: roaster.phone,
          distance: roaster.distance
        }
        // console.log(entry)
        dataArray.push(entry)
      })
      console.log(dataArray)
      res.json({
        title: 'Roaster List',
        data: dataArray
      });
    });
}

exports.index = (req, res) => {
  if (req.user) {
    user = req.user
  } else {
    user = null
  }
  // if(passport.userLoggedIn){
  console.log(googleToken)
  //   currentUser = user
  // }else{
  //   currentUser = null
  // }
  //
  // console.log(currentUser)
  async.series({
    roaster_count: (callback) => {
      Roaster.countDocuments({ 'userID': uniqueID }, callback);
      // console.log(callback)
    }
  }, (err, results) => {
    console.log(results)
    res.render('index', {
      title: 'Home',
      googleKey: googleToken,
      currentUser: user,
      error: err,
      user: 'blank',
      data: results
    });
  });
};


exports.search = (req, res, next) => {
  if (req.user) {
    user = req.user
  } else {
    user = null
  }
  Roaster.deleteMany({ 'userID': uniqueID }, (err, roaster) => { })

  dataArray = []
  setTimeout(() => {
    Roaster.deleteMany({ 'userID': uniqueID }, (err, roaster) => {
      if (err) { console.log(err) }
      // console.log(`${roaster}`)
      // console.log(`roasters with userID = "${uniqueID}" deleted`)
    })
  }, timeout)

  let inputContent = req.body.textField;
  // console.log(inputContent);
  const searchRequest = {
    term: 'Coffee Roasters',
    location: inputContent,
    limit: 15
  };
  console.log('yelp token', yelpToken)
  const client = yelp.client(yelpToken);
  console.log('client', client)
  let result = {};
  let results = [];

  client.search(searchRequest).then(response => {
    const keys = Object.keys(response.jsonBody.businesses)
    console.log(keys)
    for (let i = 0; i < keys.length; i++) {
      const name = response.jsonBody.businesses[i].name;
      const isPhone = response.jsonBody.businesses[i].phone
      if (isPhone) {
        rawPhone = isPhone;
      }
      const loc = response.jsonBody.businesses[i].location;
      const coords = response.jsonBody.businesses[i].coordinates;
      const rawDist = response.jsonBody.businesses[i].distance;

      const phoneString = rawPhone.toString()
      const phoneNumber = phoneParser.parsePhoneNumberFromString(phoneString)
      const phone = phoneNumber.formatNational()
      const address = `${loc.display_address[0]}, ${loc.display_address[1]}`
      const lat = math.round(coords.latitude, 3)
      const long = math.round(coords.longitude, 3)
      const distInMiles = math.round((rawDist / 1609.34), 1)
      const dist = `${distInMiles} mi`

      result = {
        "userID": uniqueID.toString(),
        "name": name.toString(),
        "loc": address.toString(),
        "coords": { lat: lat, lng: long },
        "phone": phone,
        "dist": dist.toString()
      }

      // returns all the names to be added
      // console.log(`from search ${result.coords}`)

      async.series({
        input: (callback) => {
          callback(null, result)
        },
        search: (callback) => {
          Roaster.findOne({ name: result.name }, (err, obj) => {
            callback(null, obj)
          })
          // .exec(callback)

        }
      }, (err, result) => {
        if (err) { return next(err); }
        let search = result.search
        // let input = result.input
        // console.log(input)
        if (search < 1) {
          let roaster = new Roaster({
            userID: result.input.userID,
            name: result.input.name,
            address: result.input.loc,
            coordinates: result.input.coords,
            phone: result.input.phone,
            distance: result.input.dist
          });
          // console.log(`adding ${roaster}`)
          roaster.save((err) => {
            if (err) { return next(err); }
          })
        } else {
          // console.log(`${result.input.name} exists`)
        }
      });
    }
  })
  // console.log(dataArray.length)
  res.render('index', {
    currentUser: user,
    googleKey: googleToken
  })
};

// Display list of all Roasters.
exports.listGet = (req, res, next) => {
  if (req.user) {
    user = req.user
  } else {
    user = null
  }

  console.log(req.body)

  Roaster.find({ 'userID': uniqueID })
    .sort([['name', 'ascending']])
    .exec((err, list_roasters) => {

      // console.log(list_roasters)

      list_roasters.forEach((roaster) => {
        lat = roaster.coordinates.lat
        long = roaster.coordinates.lat
        roaster.coordinates = `lat: ${lat}, long: ${long}`
      })

      if (err) { return next(err) }
      res.render('roaster/list', {
        title: 'Roaster List',
        roasterList: list_roasters,
        currentUser: user
      });
    });
};

// Delete Roasters.
exports.listPost = (req, res, next) => {
  if (req.user) {
    user = req.user
  } else {
    user = null
  }
  Roaster.deleteMany({})
    // Roaster.deleteMany()

    // .populate('roaster')
    .exec((err) => {
      if (err) { return next(err) }
      res.render('roaster/list', {
        title: 'Roaster List',
        currentUser: user
        // roasterList: list_roasters
      });
    })

};


// Display detail page for a specific Roaster.
exports.detail = (req, res, next) => {
  if (req.user) {
    user = req.user
  } else {
    user = null
  }
  async.parallel({
    roaster: (callback) => {
      Roaster.findById(req.params.id)
        .exec(callback)
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.roaster == null) { // No results.
      let err = new Error('Roaster not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render('roaster/detail', {
      title: 'Roaster Detail',
      roaster: results.roaster,
      currentUser: user
    });
  });

};




// Display Roaster create form on GET.
exports.createGet = (req, res, next) => {
  if (req.user) {
    user = req.user
  } else {
    user = null
  }
  async.parallel({
    roaster: (callback) => {
      Roaster.find(callback);
    }
  }, (err, results) => {
    if (err) { return next(err); }
    res.render('roaster/form', { title: 'Create Roaster', roaster: results.name, address: results.address, phone: results.phone });
  });
};


// Handle Roaster create on POST.
exports.createPost = (req, res, next) => {
  if (req.user) {
    user = req.user
  } else {
    user = null
  }
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  let roaster = new Roaster({
    name: req.body.Name,
    address: req.body.Address,
    phone: req.body.Phone
  });
  if (!errors.isEmpty()) {
    async.parallel({
      roaster: (callback) => {
        Roaster.find(callback);
      },
    }, (err, results) => {
      if (err) { return next(err); }
      res.render('roaster/form', {
        title: 'Create Roaster',
        roaster: results.name,
        address: results.address,
        phone: results.phone,
        currentUser: user,
        errors: errors.array()
      });
    });
    return;
  } else {
    roaster.save((err) => {
      if (err) { return next(err); }
      res.redirect(`${roaster.id}`);
    });
  }
}




// Display Roaster delete form on GET.
exports.deleteGet = (req, res, next) => {
  if (req.user) {
    user = req.user
  } else {
    user = null
  }
  async.parallel({
    roaster: (callback) => {
      Roaster.findById(req.params.id).exec(callback)
    },
  }, (err, results) => {
    if (err) { return next(err); }
    // console.log(results.roaster.name)

    // Successful, so render.
    res.render('roaster/delete', {
      title: 'Delete Roaster',
      name: results.roaster.name,
      id: results.roaster.id,
      currentUser: user
    });
  });
};


// delete roaster
exports.deletePost = (req, res, next) => {
  if (req.user) {
    user = req.user
  } else {
    user = null
  }
  async.parallel({
    roaster: (callback) => {
      Roaster.find(callback)
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.roaster.length > 0) {
      res.render('roaster/delete', {
        title: 'Delete Roaster',
        roaster: results.name,
        address: results.address,
        phone: results.phone,
        currentUser: user
      });
      return;
    } else {
      // nothing
    }
  });
};
