const express = require('express');
const router = express.Router();
const axios = require('axios')

// GET home page.
router.get('/', function (req, res) {
  res.redirect('/catalog');
});

module.exports = router;
