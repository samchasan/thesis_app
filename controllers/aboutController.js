const {body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const passport = require('passport');


exports.about = function(req, res) {
  // hope to have user here

console.log(req.user)
// let user = req
// console.log(req.user)
  // passport.authenticate('local', function(err, user, info) {
  //     if (err) { return next(err); }
  //     if (!user) { return res.redirect('user/login'); }
  //     req.logIn(user, function(err) {
  //       if (err) { return next(err); }
  //       res.render('about', {
  //           title: 'About',
  //           user: req.user.username
  //           })
  //   })(req, res, next);
  // });
}

//
//   if(req.isAuthenticated){
//   console.log('in about function')
//   res.render('about', {
//     title: 'About',
//     // user: req.user.username
//     })
//   }
// }
