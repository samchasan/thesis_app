const {body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const async = require('async')
var debug = require('debug')('roaster');
var Roaster = require('../models/roasters');
var bodyParser = require('body-parser');
const yelp = require('yelp-fusion');
const apiKey = 'wGqzd3D0HanzPEzCzsL6564joQ193ruYklVwN3si1zfkH6tQfsUnYHyOaMSmF4Qlz3kcnweFNGRcukXCcuvaJ_9MOw-1PfHc2Ql1BR-hXXv5cevs43CgmZVgiTpxXHYx';
const mongoose = require('mongoose');
const math = require('mathjs');
var phoneParser = require('libphonenumber-js');
var rawPhone = "0000000000"
const uuid = require('uuid/v4')
const uniqueID = uuid()
console.log('roaster controller: ' + uniqueID)
// timeout in milliseconds
const timeout = 30 * 1000




// const uuid = require('uuid/v4')
// const session = require('express-session')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

exports.index = function(req, res) {
  // console.log(req.sessionID)
  async.series({
    roaster_count: function(callback) {
      Roaster.countDocuments({}, callback);
    }
  }, function(err, results) {
    res.render('index', {
      title: 'Chaff Map Home',
      error: err,
      data: results
    });
  });
};


exports.search = function(req, res, next) {
  setTimeout(function(){
    Roaster.deleteMany({ 'userID': uniqueID}, function (err, roaster) {
    // console.log(roaster)
    console.log(`roasters with userID = "${uniqueID}" deleted`)})
    }, timeout)

  let inputContent = req.body.textField;
	// console.log(inputContent);
  const searchRequest = {
    term:'Coffee Roasters',
    location: inputContent,
    limit: 5
  };

    const client = yelp.client(apiKey);
    let result = {};
    let results = [];

    client.search(searchRequest).then(response => {
      const keys = Object.keys(response.jsonBody.businesses)

        for (var i = 0; i < keys.length; i++){
        const name = response.jsonBody.businesses[i].name;
        const isPhone = response.jsonBody.businesses[i].phone
        if(isPhone){
              rawPhone = isPhone;
            }
        const loc = response.jsonBody.businesses[i].location;
        const coords = response.jsonBody.businesses[i].coordinates;
        const rawDist = response.jsonBody.businesses[i].distance;

        const phoneString = rawPhone.toString()
        const phoneNumber = phoneParser.parsePhoneNumberFromString(phoneString)
        const phone = phoneNumber.formatNational()
        const address = `${loc.display_address[0]}, ${loc.display_address[1]}`
        const lat = math.round(coords.latitude,3)
        const long = math.round(coords.longitude,3)
        const distInMiles = math.round((rawDist/1609.34),1)
        const dist = `${distInMiles} mi`

        result = {
          "userID": uniqueID.toString(),
          "name" : name.toString(),
          "loc" : address.toString(),
          "coords" : `${lat}, ${long}`,
          "phone" : phone,
          "dist" : dist.toString()
        }

        // returns all the names to be added
        // console.log(result.name)

        async.series({
            input: function(callback){
              callback(null,result)
            },
            search: function(callback) {
                Roaster.findOne({name:result.name}, function(err, obj){
                  callback(null, obj)
                })
                  // .exec(callback)

            }
        }, function(err, result) {
            if (err) { return next(err); }
            var search = result.search
            var input = result.input
            // console.log(search)
            if (search <= 1){
              var roaster = new Roaster({
                  userID: result.input.userID,
                  name: result.input.name,
                  address: result.input.loc,
                  coordinates: result.input.coords,
                  phone: result.input.phone,
                  distance: result.input.dist
                });
                console.log(`adding ${roaster}`)
                roaster.save(function(err) {
                      if (err) {  return next(err); }
                    })
            } else {
              console.log(`${result.input.name} exists`)
            }
            // if (results.roaster.length == 0) { // No results.
            //      console.log('not found, saving')
            //      console.log(results.roaster.length)
                //  var roaster = new Roaster({
                //      userID: result.userID,
                //      name: result.name,
                //      address: result.loc,
                //      coordinates: result.coords,
                //      phone: result.phone,
                //      distance: result.dist
                //    });
                //    roaster.save(function(err) {
                //          if (err) {  return next(err); }
                //        })
                // } else {
            //     console.log('roaster found, not saving')
            // }
            // Successful, so render
            // res.render('roaster_detail', { title: 'Roaster Detail', roaster: results.roaster } );
        });

        // async.series([
        //    function(cb){
        //      console.log(`searching for ${result.name}`)
        //       cb(null, Roaster.find({'name':result.name}));
        //    }],
        //    function(err, result){
        //      console.log(result)
             // if(result == null){
             //   console.log(`saving ${result} to db!`)
             //
             //   var roaster = new Roaster({
             //     userID: result.userID,
             //     name: result.name,
             //     address: result.loc,
             //     coordinates: result.coords,
             //     phone: result.phone,
             //     distance: result.dist
             //   });
             //   roaster.save(function(err) {
             //         if (err) {  return next(err); }
             //       })
             //   } else {
             //     console.log(`${result.name} exists!`)
             //     // console.log(results)
             //   }
           // });



            // roaster.save(function(err) {
            //   if (err) {  return next(err); }
            // });
          }
        })

  res.redirect('/catalog')
};

// Display list of all Roasters.
exports.Roaster_list_get = function(req, res, next) {
    Roaster.find({ 'userID': uniqueID})
      .sort([['name', 'ascending']])
      .exec(function(err, list_roasters) {
      if (err) { return next(err) }
      res.render('roaster_list', {
        title: 'Roaster List',
        roaster_list: list_roasters
      });
    });

};

// Display list of all Roasters.
exports.Roaster_list_post = function(req, res, next) {
    Roaster.find()
    Roaster.remove()

      // .populate('roaster')
      .exec(function(err, list_roasters) {
      if (err) { return next(err) }
      res.render('index',{
        title: 'Chaff Map Home',
        data:{
          roaster_count: 0
        }
      });
    });
};




// Display detail page for a specific Roaster.
exports.Roaster_detail = function(req, res, next) {

    async.parallel({
        roaster: function(callback) {
            Roaster.findById(req.params.id)
              .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.roaster==null) { // No results.
            var err = new Error('Roaster not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('roaster_detail', { title: 'Roaster Detail', roaster: results.roaster } );
    });

};




// Display Roaster create form on GET.
exports.Roaster_create_get = function(req, res, next) {
    async.parallel({
        roaster: function(callback) {
            Roaster.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('roaster_form', { title: 'Create Roaster', roaster: results.name, address: results.address, phone: results.phone } );
    });
};


// Handle Roaster create on POST.
exports.Roaster_create_post = [
  // Validate that the name field is not empty.
  body('Name','Title must not be empty.').isLength({ min: 1 }).trim(),
  body('Address','Address must not be empty.').isLength({ min: 1 }).trim(),
  body('Phone','Phone must not be empty.').isLength({ min: 1 }).trim(),

  sanitizeBody('Name').trim().escape(),
  sanitizeBody('Address').trim().escape(),
  sanitizeBody('Phone').trim().escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    var roaster = new Roaster({
      name: req.body.Name,
      address: req.body.Address,
      phone: req.body.Phone
    });
    if (!errors.isEmpty()) {
      async.parallel({
          roaster: function(callback) {
              Roaster.find(callback);
          },
        }, function(err, results) {
                if (err) { return next(err); }
    res.render('roaster_form', { title: 'Create Roaster', roaster: results.name, address: results.address, phone: results.phone, errors: errors.array() });
  });
    return;
    } else {
      roaster.save(function(err) {
        if (err) {  return next(err); }
        res.redirect(`${roaster.id}`);
      });
    }
  }
];




// Display Roaster delete form on GET.
exports.Roaster_delete_get = function(req, res, next) {

  async.parallel({
          roaster: function(callback) {
              Roaster.findById(req.params.id).exec(callback)
          },
      }, function(err, results) {
          if (err) { return next(err); }
          // console.log(results.roaster.name)

          // Successful, so render.
          res.render('roaster_delete', { title: 'Delete Roaster', name: results.roaster.name, id: results.roaster.id} );
      });
};






// Handle Roaster delete on POST.
exports.Roaster_delete_post = function(req, res, next) {

      async.parallel({
          roaster: function(callback) {
            Roaster.find(callback)
          },
      }, function(err, results) {
          if (err) { return next(err); }
          if (results.roaster.length > 0) {
              res.render('roaster_delete', { title: 'Delete Roaster', roaster: results.name, address: results.address, phone: results.phone } );
              return;
          } else {
            // nothing
          }
      });};



// Display Roaster update form on GET.
// exports.Roaster_update_get = function(req, resnext) {
//
//   // Get roaster, authors and genres for form.
//   async.parallel({
//     roaster: function(callback) {
//       Roaster.findById(req.params.id).exec(callback)
//     },
//   }, function(err, results) {
//     if (err) {
//       return next(err);
//     }
//     if (results.roaster == null) { // No results.
//       var err = new Error('Roaster not found');
//       err.status = 404;
//       return next(err);
//     }
//     // Success.
//
//     res.render('roaster_update', {
//       name: results.name,
//       address: results.address,
//       phone: results.phone
//     });
//   });
//
// };
//
//
// // Handle roaster update on POST.
// exports.Roaster_update_post = [
//
//   // Validate fields.
//   body('Name', 'Name must not be empty.').isLength({
//     min: 1
//   }).trim(),
//   body('Address', 'Address must not be empty.').isLength({
//     min: 1
//   }).trim(),
//   body('Phone', 'Phone must not be empty.').isLength({
//     min: 1
//   }).trim(),
//
//   // Sanitize fields.
//   sanitizeBody('Name').trim().escape(),
//   sanitizeBody('Address').trim().escape(),
//   sanitizeBody('Phone').trim().escape(),
//
//   // Process request after validation and sanitization.
//   (req, res, next) => {
//
//     // Extract the validation errors from a request.
//     const errors = validationResult(req);
//
//     // Create a roaster object with escaped/trimmed data and old id.
//     var roaster = new Roaster({
//       name: req.body.Name,
//       address: req.body.Address,
//       phone: req.body.Phone,
//     });
//     if (!errors.isEmpty()) {
//
//       // Get all authors and genres for form.
//       async.parallel({
//         roaster: function(callback) {
//           Roaster.find(callback);
//         }
//
//       }, function(err, results) {
//         if (err) {
//           return next(err);
//         }
//
//         res.render('roaster_form', {
//           name: results.name,
//           address: results.address,
//           phone: results.phone,
//           errors: errors.array()
//         });
//       });
//       return;
//     } else {
//       // Data from form is valid. Update the record.
//       Roaster.findByIdAndUpdate(req.params.id, roaster, {}, function(err, theroaster) {
//         if (err) {
//           return next(err);
//         }
//         // Successful - redirect to roaster detail page.
//         res.redirect(theroaster.url);
//       });
//     }
//   }
// ];
