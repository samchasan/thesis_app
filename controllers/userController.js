const {body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongoose = require('mongoose');
var passport = require("passport");
var User = require('../models/users');
var Project = require("../models/projects");
var Roaster = require("../models/roasters");

var bodyParser = require('body-parser');

exports.profile_get = function(req, res) {
  // User.find({})
  res.render('user_profile', {
    title: 'Welcome back'

  })
}

exports.profile_post = function(req, res) {
  // User.find({})
  // res.render('user_profile', {
  //   title: 'Welcome back'
  //
  // })
}

exports.login_get = function(req, res) {
  res.render('user_login', {
    title: 'Login'
  })
}

exports.login_post = function(req, res) {
  User.findOne({username: req.body.username}, function (err, user){
      if(err) return response.render('error', {error: 'no user' + req.body.username, title: 'error'})
  })

    // if user.compare(req.body.password){
    //
    // }
    // {
    //     successRedirect: "catalog",
    //     failureRedirect: "user_login",
    //     failureFlash: true,
    //     successFlash: 'Welcome to ChaffMap!'
    // )
}

exports.create_get = function(req, res) {
  res.render('user_create', {
    title: 'Create User'
  })
}


exports.create_post = function(req, res) {

  if (req.body.email &&
  req.body.username &&
  req.body.password &&
  req.body.passwordConf) {
    if(req.body.password == req.body.passwordConf){

  var userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordConf: req.body.passwordConf,
  }

  if(req.body.adminCode === 'secretcode123'){
    userData.isAdmin = true;
  }

  User.create(userData, function (err, user) {
    if (err) {
      console.log(err)
      return res.render("user_create", {error: err.message});
    } else {
      console.log(user)
      passport.authenticate("local")(req, res, function(){
           // req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.render("index", {currentUser: user});
            })
        }
      });
    }else{
      console.log('Passwords must match!')
    }
  }
}

exports.logout = function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/catalog");
};

exports.profile = function (req,res){
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
    // Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
    //   if(err) {
    //     req.flash("error", "Something went wrong.");
    //     return res.redirect("/");
    //   }
      res.render("user_profile",
      {
        user: foundUser
        // campgrounds: campgrounds
      });
    // })
  });
}
