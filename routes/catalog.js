const express = require('express');
const router = express.Router();

// Require controller modules.
const roaster = require('../controllers/roasterController');
const project = require('../controllers/projectController');
const about = require('../controllers/aboutController');
const user = require('../controllers/userController');

const passport = require("passport");


/// roaster ROUTES ///

// GET/POST catalog home page.
router.get('/', roaster.index);
router.post('/', roaster.search);

// about page
router.get('/about', about.about);

// create user page
router.get('/user/create', user.create_get);
router.post('/user/create', user.create_post);

// user logout
router.get('/user/logout',user.logout);

// user profile page
router.get('/user/profile', user.profile_get);
router.post('/user/profile', user.profile_post);

// user login page
router.get('/user/login', user.login_get);
router.post('/user/login', passport.authenticate('local'), user.login_post);


// GET project page.
router.get('/project/list', project.project_list);

// GET project detail page.
router.get('/project/list/:id', project.project_detail);

// router.post('/', roaster.search);


// GET/POST create a roaster
router.get('/roaster/create', roaster.Roaster_create_get);
router.post('/roaster/create', roaster.Roaster_create_post);

// GET/POST delete a roaster
router.get('/roaster/:id/delete', roaster.Roaster_delete_get);
router.post('/roaster/:id/delete', roaster.Roaster_delete_post);

// GET request show a roaster
router.get('/roaster/:id', roaster.Roaster_detail);

// GET/POST show all roaster
router.get('/roaster/details', roaster.Roaster_list_get);
router.post('/roaster/details', roaster.Roaster_list_post);

module.exports = router;
