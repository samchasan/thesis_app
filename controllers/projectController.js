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
const fs = require('fs-extra')
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
var md2pug = new (require('markdown-to-pug'))();



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
    var title = results.project[0].title

    getCase(title, description => {
      console.log(description)
      fs.writeFile('views/description.pug', description, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        render(description, msg =>{
      });
    })
  })

  function readMd(filePath,callback){
    const fileText = fs.readFileSync(`./public/projects/${filePath}.md`, "utf8")
    var mdText = md.render(fileText);
    description = md2pug.render(fileText);
    callback(description)

  }

    // async.series (
      function getCase (phrase, callback){
        switch (phrase) {
          case 'Mushrooms':
            console.log('on the mushrooms page')
            // description = $.get('/public/mushrooms.txt')
            readMd('mushrooms',callback)
          break;
          case 'Composting':
            console.log('on the composting page')
            readMd('compost',callback)
            break;
          case 'Mulching':
            console.log('on the Mmlching page')
            readMd('mulch',callback)
            break;
          case 'Cattle Feed':
            console.log('on the Cattle Feed page')
            readMd('cattle_feed',callback)
            break;
          case 'Poultry Bedding':
            console.log('on the Poultry Bedding page')
            readMd('poultry_bedding',callback)
            break;
          case 'Eco-Bricks':
            console.log('on the Eco-Bricks page')
            readMd('eco-bricks',callback)
            break;
      }


    }

    function render (description, callback){
      console.log('in render')
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
    callback('successful')
  }





  });


}
