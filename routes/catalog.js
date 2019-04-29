const express = require('express');
const multer = require('multer')
const router = express.Router();

// Require controller modules.
const roaster = require('../controllers/roasterController');
const project = require('../controllers/projectController');
const waste = require('../controllers/wasteController');
const about = require('../controllers/aboutController');
const user = require('../controllers/userController');

const passport = require('passport');

const upload = multer({
  dest: 'public/uploads/',
  rename: function (fieldname, filename) {
    return filename;
  }
})


/// roaster ROUTES ///

// GET/POST catalog home page.
router.get('/', roaster.index);
router.post('/', user.search);

// about page
router.get('/about', about.about);

router.get('/data', roaster.data);
// router.post('/data', roaster.abdataout);

router.get('/currentUserJSON', user.currentUserJSON);

// project page
router.get('/projects', project.projects);

router.post('/projectsJSON', project.projectsJSON)
router.get('/projectsJSON', project.projectsJSON)

// project page
router.get('/wastes', waste.wastes);

router.post('/wastesJSON', waste.wastesJSON)
router.get('/wastesJSON', waste.wastesJSON)

// register user page
router.get('/register', user.registerGet);
router.post('/register', user.registerPost);

router.post('/user/profile/:user/userJSON', user.userJSON)
router.get('/user/profile/:user/userJSON', user.userJSON)

// user logout
router.get('/logout', user.logout);

// user profile page
router.get('/user/profile/:user', user.profileGet);
router.post('/user/profile/:user', user.updateUser);
router.post('/user/profile/:user/deleteUser', user.deleteUser);


// user make and upload avatar
// router.post('/user/makeAvatar', upload.single('file'), user.makeAvatar);
router.post('/user/profile/:user/postAvatar', user.postAvatar)

router.post('/user/profile/:user/addProject', user.addProjectPost)
router.get('/user/profile/:user/addProject', user.addProjectGet)

router.post('/user/profile/:user/addWaste', user.addWastePost)
router.get('/user/profile/:user/addWaste', user.addWasteGet)

router.post('/user/profile/:user/projectJSON', user.projectJSON)
router.get('/user/profile/:user/projectJSON', user.projectJSON)

router.post('/user/profile/:user/:projectId/singleProjectJSON', user.singleProjectJSON)
router.get('/user/profile/:user/:projectId/singleProjectJSON', user.singleProjectJSON)

router.post('/user/profile/:user/waste/:waste/singleWasteJSON', user.singleWasteJSON)
router.get('/user/profile/:user/waste/:waste/singleWasteJSON', user.singleWasteJSON)

router.post('/user/profile/:user/avatarJSON', user.avatarJSON)
router.get('/user/profile/:user/avatarJSON', user.avatarJSON)

router.post('/user/profile/:user/wasteJSON', user.wasteJSON)
router.get('/user/profile/:user/wasteJSON', user.wasteJSON)

router.post('/user/profile/:user/:project/deleteProject', user.deleteProject)
router.post('/user/profile/:user/:project', user.updateProject)
router.get('/user/profile/:user/:project', user.viewProject)

router.post('/user/profile/:user/waste/:waste/deleteWaste', user.deleteWaste)
router.post('/user/profile/:user/waste/:waste', user.updateWaste)
router.get('/user/profile/:user/waste/:waste', user.viewWaste)

// user login page
router.get('/login', user.loginGet);
router.post('/login', passport.authenticate('local'), user.loginPost);

// GET project page.
router.get('/project/list', project.list);

// GET project detail page.
router.get('/project/list/:id', project.detail);

// GET/POST register a roaster
router.get('/roaster/create', roaster.createGet);
router.post('/roaster/create', roaster.createPost);

// GET/POST delete a roaster
router.get('/roaster/:id/delete', roaster.deleteGet);
router.post('/roaster/:id/delete', roaster.deletePost);

// GET request show a roaster
router.get('/roaster/:id', roaster.detail);

// GET/POST show all roaster
router.get('/roaster/details', roaster.listGet);
router.post('/roaster/details', roaster.listPost);

module.exports = router;
