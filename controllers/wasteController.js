const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');
const async = require('async')
const Waste = require('../models/waste');
const mongoose = require('mongoose');
const S = require('string');
const fs = require('fs-extra')
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();
const md2pug = new (require('markdown-to-pug'))();



exports.wastesJSON =
  (req, res, next) => {
    Waste.find().exec((err, wastes) => {
      if (err) return next(err);
      if (wastes) {
        // console.log('wastes found: ' + wastes)
        res.json({ wastes })
      }
    })
  }

function isUserLoggedIn(user) {
  if(user){
    return user.username
  }else{
    return null
  }
}

exports.wastes =
  (req, res) => {
    const user = req.params.user
    const currentuser = isUserLoggedIn(req.user)
    res.render('wastes', {
      title: 'waste',
      currentUser: currentuser
    })
  }

