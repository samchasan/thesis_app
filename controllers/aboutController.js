const {body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.about = function(req, res) {
  res.render('about', {
    title: 'About'
  })
}
