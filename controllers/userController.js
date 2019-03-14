const {body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongoose = require('mongoose');
var User = require('../models/users');
var Project = require('../models/projects');
var Roaster = require('../models/roasters');
const passport = require('passport');

var bodyParser = require('body-parser');

exports.profile_get = function(req, res) {
  console.log(req.body)
  res.render('user/profile', {
    title: 'Welcome back'

  })
}

exports.profile_post = function(req, res) {
  if (loggedIn){

  }else{

  }
  // User.find({})
  // res.render('user_profile', {
  //   title: 'Welcome back'
  //
  // })
}

exports.login_get = function(req, res) {
  res.render('user/login', {
    title: 'Login'
  })
}

exports.login_post = function(req, res) {
user = req.body
// console.log(user)
User.findOne({username: user.username}, function(err, user){
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

exports.create_get = function(req, res) {
  console.log(req.body)
  res.render('user/create', {
    title: 'Create User'
  })
}

exports.create_post = function(req, res) {

  if (req.body.email &&
  req.body.username &&
  req.body.password
  ){

  var userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  }

  if(req.body.adminCode === 'secretcode123'){
    userData.isAdmin = true;
  }

  User.create(userData, function (err, user) {
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





exports.logout = function(req, res){
   req.logout();
   // req.flash('success', 'See you later!');
   res.redirect('/catalog');
};
