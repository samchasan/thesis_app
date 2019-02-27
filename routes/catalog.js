var express = require('express');
var router = express.Router();

// Require controller modules.
var roaster_controller = require('../controllers/roasterController');

/// roaster ROUTES ///

// GET catalog home page.
router.get('/', roaster_controller.index);

// GET request for creating a roaster. NOTE This must come before routes that display roaster (uses id).
router.get('/roasters/create', roaster_controller.Roaster_create_get);

// POST request for creating roaster.
router.post('/roasters/create', roaster_controller.Roaster_create_post);

// GET request to delete roaster.
router.get('/roasters/:id/delete', roaster_controller.Roaster_delete_get);

// POST request to delete roaster.
router.post('/roasters/:id/delete', roaster_controller.Roaster_delete_post);

// GET request to update roaster.
// router.get('/roasters/:id/update', roaster_controller.Roaster_update_get);

// POST request to update roaster.
// router.post('/roasters/:id/update', roaster_controller.Roaster_update_post);

// GET request for one roaster.
router.get('/roasters/:id', roaster_controller.Roaster_detail);

// GET request for list of all roaster items.
router.get('/roasters', roaster_controller.Roaster_list);

module.exports = router;
