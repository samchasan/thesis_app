const express = require('express');
const router = express.Router();
const axios = require('axios')

// GET home page.
router.get('/', function (req, res) {
  axios.post('currentUserJSON', { currentUser: req.user })
  // window.currentUser = req.user
  // console.log('window location', window.location)
  // console.log('user', req.user)
  res.redirect('/catalog');
});

module.exports = router;
