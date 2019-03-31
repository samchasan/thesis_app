const express = require('express');
const multer = require('multer')
const router = express.Router();

// Require controller modules.
const roaster = require('../controllers/roasterController');
const project = require('../controllers/projectController');
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

// user make and upload files
// router.post('/user/makeAvatar', upload.single('file'), user.makeAvatar);
router.post('/user/postAvatar', user.postAvatar)

// router.post('/user/makeWaste', upload.single('file'), user.makeWaste);
// router.post('/user/postWaste', user.postWaste)


router.post('/user/addProject', user.addProjectPost)
router.get('/user/addProject', user.addProjectGet)

router.post('/user/addWaste', user.addWastePost)
router.get('/user/addWaste', user.addWasteGet)

router.post('/user/projectJSON', user.projectJSON)
router.get('/user/projectJSON', user.projectJSON)

router.post('/user/avatarJSON', user.avatarJSON)
router.get('/user/avatarJSON', user.avatarJSON)

router.post('/user/wasteJSON', user.wasteJSON)
router.get('/user/wasteJSON', user.wasteJSON)


// user login page
router.get('/user/login', user.loginGet);
router.post('/user/login', passport.authenticate('local'), user.loginPost);


// GET project page.
router.get('/project/list', project.list);

// GET project detail page.
router.get('/project/list/:id', project.detail);

// router.post('/', roaster.search);


// GET/POST create a roaster
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
