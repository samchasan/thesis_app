const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
const mongoose = require('mongoose');
const User = require('../models/users');
const Project = require('../models/projects');
const Roaster = require('../models/roasters');
const passport = require('passport');
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const path = require('path');

// const uuidv4 = require('uuid/v4');


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null,
       file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
                 storage: storage,
                 limits: {fileSize: 1000000},
                 fileFilter: function(req, file, cb) {
                   checkFileType(file, cb);
                 }
               }).single('myImage');

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

exports.postFile =
    (req, res) => {
      console.log(req.body)
      
      upload(req, res, (err) => {
        // console.log(req.file)
        if (err) {
          res.render('user/profile', {msg: err, currentUser: req.user});
        } else if (req.file) {
          // if (req.file == undefined) {
          //   res.render(
          //       'user/profile',
          //       {msg: 'Error: No File Selected!', currentUser: req.user});
          // } else {
            
          res.render('user/profile', {
            msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`,
            currentUser: req.user
          })
          console.log(`uploads/${req.file.filename}`);
        }
      });
    }


                  exports.getFile =
        (req, res) => {
          // console.log(req.data)
          res.render('user/avatar', {title: 'User Avatar', data: req})
        }

                      exports.profileGet =
            (req, res) => {
              console.log(req.body)
              if (req.user) {
                res.render(
                    'user/profile', {title: 'Welcome back', currentUser: user})
              }
            }

                          exports.avatarUpload =
                (req, res, next) => {
                  let uploadFile = req.files.file
                  const fileName = req.files.file.name
                  uploadFile.mv(
                      `${__dirname}/public/img/${fileName}`,
                      function(err) {
                        if (err) {
                          return res.status(500).send(err)
                        }

                        res.json({
                          file: `public/img/${req.files.file.name}`,
                        })
                      },
                  )
                }


                                    exports.loginGet =
                    (req, res) => {
                      res.render('user/login', {title: 'Login'})
                    }

                                  exports.loginPost =
                        (req, res) => {
                          user = req.body
                          // console.log(user)
                          User.findOne(
                              {username: user.username}, (err, user) => {
                                if (err) {
                                  res.render(
                                      'login', {title: 'Error, try again'})
                                } else {
                                  // res.redirect('profile')
                                  res.render('user/profile', {
                                    title: 'Welcome Back',
                                    currentUser: user
                                  })
                                }
                              })
                        }

                                      exports.createGet =
                            (req, res) => {
                              console.log(req.body)
                              res.render('user/create', {title: 'Create User'})
                            }

                                          exports.createPost =
                                (req, res) => {
                                  if (req.body.email && req.body.username &&
                                      req.body.password) {
                                    const userData =
                                        {
                                          email: req.body.email,
                                          username: req.body.username,
                                          password: req.body.password,
                                          avatar: req.body.avatar
                                        }



                                        User.create(userData, (err, user) => {
                                          if (err) {
                                            console.log(err)
                                            return res.render(
                                                'user/create',
                                                {error: err.message});
                                          } else {
                                            console.log(user)
                                            return res.render('user/profile', {
                                              title: `Welcome ${user.username}`,
                                              currentUser: user
                                            });
                                          }
                                        })
                                  }
                                }



                                              exports.logout = (req, res) => {
                                  req.logout();
                                  // req.flash('success', 'See you later!');
                                  res.redirect('/catalog');
                                };
