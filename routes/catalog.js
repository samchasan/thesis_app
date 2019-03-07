var express = require('express');
var router = express.Router();

// Require controller modules.
var roaster_controller = require('../controllers/roasterController');
var project_controller = require('../controllers/projectController');
var about_controller = require('../controllers/aboutController');

/// roaster ROUTES ///

// GET/POST catalog home page.
router.get('/', roaster_controller.index);
router.post('/', roaster_controller.search);

router.get('/about', about_controller.about);


// GET projects page.
router.get('/project_list', project_controller.project_list);

// GET project detail page.
router.get('/project_list/:id', project_controller.project_detail);

// router.post('/', roaster_controller.search);



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
router.post('/roasters', roaster_controller.Roaster_list_post);

module.exports = router;
