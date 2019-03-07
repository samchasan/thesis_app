const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');
const async = require('async')
var Project = require('../models/projects');
const mongoose = require('mongoose');
var S = require('string');



exports.project_list = function(req, res) {
  res.render('project_list', {
    title: 'Projects'
  })
}

exports.project_detail = function(req, res) {

  async.parallel({
    project: function(callback) {
      var input = req.params.id.toString()
      // console.log(input)
      var shortened = S(input).chompRight('.html').s; //'bar'
      var title = S(shortened).capitalize().s; //'Jon'
      switch (title) {
        case 'Cattle_feed':
          title = 'Cattle Feed'
          break;
        case 'Poultry_bedding':
          title = 'Poultry Bedding'
          break;
        case 'Eco-bricks':
          title = 'Eco-Bricks'
          break;
      }

      console.log(title)

      Project.find({
          title: title
        })
        .exec(callback)
    },
  }, function(err, results) {
    console.log(results)
    if (err) {
      console.log(err);
    }
    if (results.project == null) { // No results.
      var err = new Error('Project not found');
      err.status = 404;
      // return next(err);
    }
    var description
    switch (results.project[0].title) {
      case 'Mushrooms':
        console.log('on the mushrooms page')
        description = 'on the mushrooms page'
        break;
      case 'Composting':
        console.log('on the composting page')
        description = 'on the composting page'
        break;
      case 'Mulching':
        console.log('on the Mmlching page')
        description = 'on the mulching page'
        break;
      case 'Cattle Feed':
        console.log('on the Cattle Feed page')
        description = 'on the Catte Feed  page'
        break;
      case 'Poultry Bedding':
        console.log('on the Poultry Bedding page')
        description = 'on the Poultry Bedding page'
        break;
      case 'Eco-Bricks':
        console.log('on the Eco-Bricks page')
        description = 'on the Eco-Bricks page'
        break;
    }


    // Successful, so render
    res.render('project_detail', {
      title: results.project[0].title,
      materials: S([results.project[0].materials]).toCSV().s, //'"a","b","c"',
      complexity: results.project[0].complexity,
      expense: results.project[0].expense,
      tags: S([results.project[0].tags]).toCSV().s,
      headline: results.project[0].headline,
      description: description
    })




  });


}
