const mongoose = require('mongoose');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

var User = require('../models/users');

passport.use(new Strategy({
  usernameField: 'username',
  passwordField: 'password',

  // usernameField: 'user[email]',
  // passwordField: 'user[password]',
}, (username, password, done) => {
  // console.log(username)
  // console.log(password)

  User.findOne({ username })
    .then((user) => {
      // console.log(user)
      if(!user || !user.compare(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }
      return done(null, user);
    }).catch(done);
}));
