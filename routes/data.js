
// Bear models lives here
var express = require('express');
var router = express.Router();
var roaster_controller = require('../controllers/roasterController');


// ROUTES FOR OUR API
// =============================================================================

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

router.get('', roaster_controller.data);
//
// router.get('/', function(req, res) {
// 	res.json({ message: 'hooray! welcome to our api!' });
// });

module.exports = router;
