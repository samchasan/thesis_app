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
let newAvatar;
let newWaste;
let newProject;



const makeNewPhoto = (newPhoto, photoAdded, parentName, childName) => {
  newPhoto.img.data = photoAdded.data;
  newPhoto.img.contentType = photoAdded.mimetype;
  newPhoto.category.parent = parentName
  newPhoto.category.child = childName
  newPhoto.name = photoAdded.name;
  newPhoto.userId = req.user.id;
  console.log('made a photo')
}


exports.makeAvatar =
  (req, res) => {
    console.log('in make avatar')
    const photoToAdd = req.files.file
    newAvatar = new Photo();

    makeNewPhoto(newAvatar, photoToAdd, 'avatar', null)

    res.render('user/profile', {
      title: 'New avatar ready',
      currentUser: req.user
    })

  }

exports.makeWaste =
  (req, res) => {
    const photoToAdd = req.files.file
    newWaste = new Photo();

    makeNewPhoto(newWaste, photoToAdd, 'waste', 'paper')

    res.render('user/profile', {
      title: 'Waste ready to dump!',
      currentUser: req.user
    })
  }


exports.makeProject =
  (req, res) => {
    const photoToAdd = req.files.file
    newProject = new Photo();

    makeNewPhoto(newProject, photoToAdd, 'project', 'mushrooms')

    res.render('user/profile', {
      title: 'Project ready to be made!',
      currentUser: req.user
    })
  }


exports.postAvatar =
  (req, res) => {
    const id = req.user._id.toString()
    console.log(id)

    deletePhotos()

    async function deletePhotos() {
      await Photo.deleteMany({ 'userId': id, category: { parent: 'avatar' } })
      showNewPhoto()
    }

    function showNewPhoto() {
      newAvatar.save();
      res.render('user/profile', {
        title: 'Wow groovy new profile pic',
        currentUser: req.user
      })
    }
  }

exports.postWaste =
  (req, res) => {
    const id = req.user._id.toString()
    console.log(id)
    newWaste.save();
    res.render('user/profile', {
      title: 'good lookin gold there',
      currentUser: req.user
    })
  }

exports.postProject =
  (req, res) => {
    const id = req.user._id.toString()
    console.log(id)
    newProject.save();
    res.render('user/profile', {
      title: 'cool project!',
      currentUser: req.user
    })
  }





exports.avatarJSON =
  (req, res, next) => {
    const id = req.user._id.toString()
    console.log('in avatarJSON')

    Photo.find({ userId: id, category: { parent: 'avatar' } }).exec((err, photo) => {
      console.log('photo found' + photo)
      if (err) return next(err);
      if (photo) {
        res.json({ photo })
      }
    })
  }

exports.projectJSON =
  (req, res, next) => {
    const id = req.user._id.toString()
    Photo.find({ userId: id, category: { parent: 'project' } }).exec((err, photos) => {
      if (err) return next(err);
      if (photos) {
        res.json({ photo })
      }
    })
  }

exports.wasteJSON =
  (req, res, next) => {
    const id = req.user._id.toString()
    Photo.find({ userId: id, category: { parent: 'waste' } }).exec((err, photos) => {
      if (err) return next(err);
      if (photos) {
        res.json({ photo })
      }
    })
  }

exports.profileGet =
  (req, res) => {
    res.render('user/profile', {
      title: 'Welcome Back',
      currentUser: req.user
    })
  }




exports.loginGet =
  (req, res) => {
    res.render('user/login', { title: 'Login' })
  }

exports.loginPost =
  (req, res) => {
    user = req.body
    User.findOne({ username: user.username }, (err, user) => {
      if (err) {
        res.render('login', { title: 'Error, try again' })
      } else {
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
  res.redirect('/catalog');
};
