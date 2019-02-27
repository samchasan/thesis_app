const {body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const async = require('async')
var debug = require('debug')('roaster');


var Roaster = require('../models/roasters');

exports.index = function(req, res) {
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



// Display list of all Roasters.
exports.Roaster_list = function(req, res, next) {
    Roaster.find()
      // .populate('roaster')
      .sort([['name', 'ascending']])
      .exec(function(err, list_roasters) {
      if (err) { return next(err) }
      res.render('roaster_list', {
        title: 'Roaster List',
        roaster_list: list_roasters
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
          console.log(results.roaster.name)

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
