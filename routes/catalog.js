var express = require('express');
var router = express.Router();

// Require controller modules.
var roaster_controller = require('../controllers/roasterController');

/// roaster ROUTES ///

// GET/POST catalog home page.
router.get('/', roaster_controller.index);
router.post('/', roaster_controller.search);
// router.post('/', roaster_controller.timeout);

// GET/POST create a roaster
router.get('/roasters/create', roaster_controller.Roaster_create_get);
router.post('/roasters/create', roaster_controller.Roaster_create_post);

// GET/POST delete a roaster
router.get('/roasters/:id/delete', roaster_controller.Roaster_delete_get);
router.post('/roasters/:id/delete', roaster_controller.Roaster_delete_post);

// GET request show a roaster
router.get('/roasters/:id', roaster_controller.Roaster_detail);

// GET/POST show all roasters
router.get('/roasters', roaster_controller.Roaster_list_get);
router.post('/roasters/delete', roaster_controller.Roaster_list_post);

module.exports = router;
