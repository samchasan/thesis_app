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
let newPhoto;

exports.makeAvatar =
  (req, res) => {
    newPhoto = new Photo();
    newPhoto.img.data = req.files.file.data;
    newPhoto.img.contentType = req.files.file.mimetype;
    newPhoto.name = req.files.file.name;
    newPhoto.userId = req.user.id;

    res.render('user/profile', {
      title: 'File Added!',
      currentUser: req.user
    })
  }

exports.postAvatar =
  (req, res) => {
    newPhoto.save();
    res.render('user/profile', {
      title: 'File Uploaded!',
      currentUser: req.user
    })
  }


exports.avatarJSON =
  (req, res, next) => {
    // console.log(req.user._id)
    const id = req.user._id.toString()
    Photo.find({ userId: id }).exec((err, photo) => {
      if (err) return next(err);
      if (photo) {
        // res.contentType(photo.img.contentType);
        // res.send(photo.img.data);
        res.json({ img: photo })
      }
    })

  }

exports.profileGet =
  (req, res, next) => {
    // console.log(req.user._id)
    const id = req.user._id.toString()
    Photo.find({ userId: id }).exec((err, photo) => {
      if (err) return next(err);
      if (photo) {
        // res.contentType(photo.img.contentType);
        // res.send(photo.img.data);
        res.json({ img: photo })
      }
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
