const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongoose = require('mongoose');
const User = require('../models/users');
const Project = require('../models/projects');
const Roaster = require('../models/roasters');
const Photo = require('../models/photos');
const passport = require('passport');
const bodyParser = require('body-parser');
const axios = require('axios');
// const multer = require('multer');
const path = require('path');
const fs = require('file-system')


exports.postFile =
  (req, res) => {
    console.log(req.files.file)
    var newPhoto = new Photo();
    newPhoto.data = req.files.file.data;
    newPhoto.contentType = req.files.file.mimetype;
    newPhoto.name = req.files.file.name;
    newPhoto.userId = req.user.id;
    newPhoto.save();

    res.render('user/profile', {
      title: 'File Uploaded!',
      // file: `uploads/${file.name}`,
      currentUser: req.user
    })
  }

exports.profileGet =
  (req, res) => {
    // console.log(req.user._id)
    const id = req.user._id.toString()
    console.log(id)

    User.find({ username: 'p' }).exec((err, user) => {
      if (err) {
        res.render('profile')
      }
      console.log(user)
    })

    Photo.find({ userId: id }).exec((err, results) => {
      if (err) {
        res.render('profile')
      }
      console.log(results)
    })

  }




exports.loginGet =
  (req, res) => {
    res.render('user/login', { title: 'Login' })
  }

exports.loginPost =
  (req, res) => {
    user = req.body
    // console.log(user)
    User.findOne({ username: user.username }, (err, user) => {
      if (err) {
        res.render('login', { title: 'Error, try again' })
      } else {
        // res.redirect('profile')
        res.render(
          'user/profile',
          { title: 'Welcome Back', currentUser: user })
      }
    })
  }

exports.createGet =
  (req, res) => {
    console.log(req.body)
    res.render('user/create', { title: 'Create User' })
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
            { error: err.message });
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
