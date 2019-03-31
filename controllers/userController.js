const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongoose = require('mongoose');
const User = require('../models/users');
const Project = require('../models/projects');
const Waste = require('../models/waste');
const Roaster = require('../models/roasters');
const Photo = require('../models/photos');
const passport = require('passport');
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const akid = process.env.AWSAccessKeyId
const asak = process.env.AWSSecretKey
const path = require('path');
const fs = require('file-system')
const AWS = require('aws-sdk');
// const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const multerS3 = require('multer-s3')
let newPhoto;
const s3Bucket = 'chaffmap'




const makeNewPhoto = (name, url, category, userID) => {
  console.log(url + ' / ' + category)
  const newPhoto = new Photo({
    'name': name,
    'category': category,
    'url': url,
    'userID': userID,
  })
  console.log('made a photo')
  console.log(newPhoto)
  newPhoto.save()
}

exports.postAvatar = (req, res) => {

  const name = req.body.key.toString()
  const url = req.body.location.toString()
  const category = 'avatar'
  const userID = req.user.id

  console.log(url + ' / ' + category)

  makeNewPhoto(name, url, category, userID)
  res.render('user/profile', {
    title: 'Cool new avatar',
    currentUser: req.user,
  });
}


exports.addProjectPost =
  (req, res) => {
    const photoName = req.body.photo.key.toString()
    const photoUrl = req.body.photo.location.toString()
    const category = 'project'
    const userID = req.user.id
    const name = req.body.text.name
    const materials = req.body.text.materials
    const location = req.body.text.location

    const newProject = new Project({
      'userID': userID,
      'title': name,
      'materials': materials,
      'location': location,
      'photo': {
        'bucket': category,
        'key': photoName,
        'url': photoUrl
      }
    })

    newProject.save()

    res.render('user/profile', {
      title: 'Welcome Back',
      currentUser: req.user
    })

  }


exports.addWastePost =
  (req, res) => {
    console.log(req.body)
    const photoName = req.body.photo.key.toString()
    const photoUrl = req.body.photo.location.toString()
    const category = 'waste'
    const userID = req.user.id
    const frequency = req.body.text.frequency
    const name = req.body.text.name
    const material = req.body.text.material
    const amount = req.body.text.amount

    const newWaste = new Waste({
      'userID': userID,
      'title': name,
      'material': material,
      'frequency': frequency,
      'amount': amount,
      // 'location': location,
      'photo': {
        'bucket': category,
        'key': photoName,
        'url': photoUrl
      }
    })

    newWaste.save()
    console.log(newWaste)

    res.render('user/profile', {
      title: 'Welcome Back',
      currentUser: req.user
    })

  }

exports.avatarJSON =
  (req, res, next) => {
    const id = req.user.id
    console.log('in avatarJSON')
    console.log(id)
    Photo.findOne({ userID: id }).exec((err, photo) => {
      if (err) return next(err);
      if (photo) {
        const photoparsed = JSON.stringify(photo)
        // console.log('photo found' + photoparsed)
        res.json(photoparsed)
      }
    })
  }

exports.projectJSON =
  (req, res, next) => {
    const id = req.user._id.toString()
    Project.find({ userID: id }).exec((err, projects) => {
      if (err) return next(err);
      if (projects) {
        // console.log('projects found: ' + projects)
        res.json({ projects })
      }
    })
  }

exports.wasteJSON =
  (req, res, next) => {
    const id = req.user.id
    // console.log('in wasteJSON')
    console.log(id)
    Waste.find({ userID: id }).exec((err, waste) => {
      if (err) return next(err);
      if (waste) {
        // const wasteparsed = JSON.stringify(waste)
        // console.log('photo found' + photoparsed)
        res.json({ waste })
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

exports.addProjectGet =
  (req, res) => {
    res.render('user/addProject', {
      title: 'Welcome Back',
      currentUser: req.user
    })
  }

exports.addWasteGet =
  (req, res) => {
    res.render('user/addWaste', {
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
