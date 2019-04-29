const {body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const passport = require('passport');


exports.about = (req, res) => {
  if (req.user){
    user = req.user.username
  }else{
    user = null
  }
        res.render('about', {
            title: 'About',
            currentUser: user
            })
 
}
