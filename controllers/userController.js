const {body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongoose = require('mongoose');
const User = require('../models/users');
const Project = require('../models/projects');
const Roaster = require('../models/roasters');
const passport = require('passport');
const bodyParser = require('body-parser');


exports.profile_get = (req, res) => {
  console.log(req.body)


  if(req.user){
  res.render('user/profile', {
    title: 'Welcome back',
    currentUser: user
  })
}

exports.AvatarUpload('/addavatar', (req, res, next) => {
  let uploadFile = req.files.file
  const fileName = req.files.file.name
  uploadFile.mv(
    `${__dirname}/public/img/${fileName}`,
    function (err) {
      if (err) {
        return res.status(500).send(err)
      }

      res.json({
        file: `public/img/${req.files.file.name}`,
      })
    },
  )
})

}

exports.profile_post = (req, res) => {

}

exports.login_get = (req, res) => {
  // if(!req.user){
  //   res.render('user/login', {
  //     title: 'Login',
  //     currentUser: null
  //   })
  // }else{
    res.render('user/login', {
      title: 'Login'
    })
  // }

}

exports.login_post = (req, res) => {
user = req.body
// console.log(user)
User.findOne({username: user.username}, (err, user) => {
      if(err){
          res.render('login', {
            title: 'Error, try again'
          })
        } else{
      // res.redirect('profile')
      res.render('user/profile', {
        title: 'Welcome Back',
        currentUser: user
      })
    }
      })
}

exports.create_get = (req, res) => {
  console.log(req.body)
  res.render('user/create', {
    title: 'Create User'
  })
}

exports.create_post = (req, res) => {

  if (req.body.email &&
  req.body.username &&
  req.body.password
  ){

  const userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  }

  if(req.body.adminCode === 'secretcode123'){
    userData.isAdmin = true;
  }

  User.create(userData, (err, user) => {
    if (err) {
      console.log(err)
      return res.render('user/create', {error: err.message});
    } else {
      console.log(user)
            return res.render('user/profile',
        { title: `Welcome ${user.username}`,
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
