const {body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const passport = require('passport');


exports.about = (req, res) => {
  // console.log(req.user)
  if (req.user){
    user = req.user
  }else{
    user = null
  }
  // hope to have user here

// console.log(req.user)
// let user = req
// console.log(req.user)
  // passport.authenticate('local', (err, user, info)=>  {
  //     if (err) { return next(err); }
  //     if (!user) { return res.redirect('user/login'); }
  //     req.logIn(user, (err) {
  //       if (err) { return next(err); }
        res.render('about', {
            title: 'About',
            currentUser: user
            // user: req.user.username
            })
  //   })(req, res, next);
  // });
}

//
//   if(req.isAuthenticated){
//   console.log('in about ')
//   res.render('about', {
//     title: 'About',
//     // user: req.user.username
//     })
//   }
// }
