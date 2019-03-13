var express = require('express');
var router = express.Router();

// Require controller modules.
var roaster = require('../controllers/roasterController');
var project = require('../controllers/projectController');
var about = require('../controllers/aboutController');
var user = require('../controllers/userController');


/// roaster ROUTES ///

// GET/POST catalog home page.
router.get('/', roaster.index);
router.post('/', roaster.search);

// about page
router.get('/about', about.about);

// create user page
router.get('/user_create', user.create_get);
router.post('/user_create', user.create_post);

// user profile page
router.get('/user_profile',user.profile);

// user logout
router.get('/logout',user.logout);


//
// // auth pathway
// router.post('/example', auth.optional, user.example);
//
// router.get('/current', auth.required, user.current);

// user profile page
router.get('/user_profile/:id', user.profile_get);
router.post('/user_profile/:id', user.profile_post);

// user login page
router.get('/user_login', user.login_get);
router.post('/user_login', user.login_post);


// GET projects page.
router.get('/project_list', project.project_list);

// GET project detail page.
router.get('/project_list/:id', project.project_detail);

// router.post('/', roaster.search);


// GET/POST create a roaster
router.get('/roasters/create', roaster.Roaster_create_get);
router.post('/roasters/create', roaster.Roaster_create_post);

// GET/POST delete a roaster
router.get('/roasters/:id/delete', roaster.Roaster_delete_get);
router.post('/roasters/:id/delete', roaster.Roaster_delete_post);

// GET request show a roaster
router.get('/roasters/:id', roaster.Roaster_detail);

// GET/POST show all roasters
router.get('/roasters', roaster.Roaster_list_get);
router.post('/roasters', roaster.Roaster_list_post);

module.exports = router;
