const express = require('express');
const router = express.Router();

// Require controller modules.
const roaster = require('../controllers/roasterController');
const project = require('../controllers/projectController');
const about = require('../controllers/aboutController');
const user = require('../controllers/userController');

const passport = require('passport');


/// roaster ROUTES ///

// GET/POST catalog home page.
router.get('/', roaster.index);
router.post('/', roaster.search);

// about page
router.get('/about', about.about);

// create user page
router.get('/user/create', user.createGet);
router.post('/user/create', user.createPost);

// user logout
router.get('/user/logout', user.logout);

// user profile page
router.get('/user/profile', user.profileGet);


router.get('/user/avatar', user.getFile);
router.post('/user/avatar', user.postFile);

// user login page
router.get('/user/login', user.loginGet);
router.post('/user/login', passport.authenticate('local'), user.loginPost);


// GET project page.
router.get('/project/list', project.projectList);

// GET project detail page.
router.get('/project/list/:id', project.projectDetail);

// router.post('/', roaster.search);


// GET/POST create a roaster
router.get('/roaster/create', roaster.RoasterCreateGet);
router.post('/roaster/create', roaster.RoasterCreatePost);

// GET/POST delete a roaster
router.get('/roaster/:id/delete', roaster.RoasterDeleteGet);
router.post('/roaster/:id/delete', roaster.RoasterDeletePost);

// GET request show a roaster
router.get('/roaster/:id', roaster.RoasterDetail);

// GET/POST show all roaster
router.get('/roaster/details', roaster.RoasterListGet);
router.post('/roaster/details', roaster.RoasterListPost);

module.exports = router;
