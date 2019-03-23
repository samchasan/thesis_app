const express = require('express');
const router = express.Router();
// router.use('/api', require('./api'));
// const passport = require("passport");

// GET home page.
router.get('/', function(req, res) {
  console.log(req.user)
  // check if user logged in
  res.redirect('/catalog');
});

module.exports = router;
