console.log('This script populates some test projects in my database');

var async = require('async')
var ProjectSchema = require('./models/projects')

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://root:1Ab029384756@ChaffMap-ljx1a.mongodb.net/Chaff_Map?retryWrites=true';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var projects = [];

function projectCreate(title, materials, complexity, expense, tags, headline, cb) {
  var projectDetail = {
    title: title,
    materials: materials,
    complexity: complexity,
    expense: expense,
    tags: tags,
    headline: headline
  }

  var project = new ProjectSchema(projectDetail);

  project.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Project: ' + project);
    projects.push(project)
    cb(null, project)
  }  );
}

function addProjects(cb) {
    async.parallel([
        function(callback) {
          projectCreate(
            'Mulching',
            ['chaff', 'grass','woodchips','moss','sawdust','yard waste'],
            'easy',
            '$',
            ['gardening','soil','simple'],
            'This is possibly the simplest of all the projects one can do with chaff',
             callback);
        },
        function(callback) {
          projectCreate(
            'Composting',
            ['chaff', 'grass','food scraps','moss','sawdust','yard waste'],
            'easy',
            '$',
            ['gardening','soil','simple'],
            'The other simplest thing you can do with chaff',
             callback);
        },
        function(callback) {
          projectCreate(
            'Mushrooms',
            ['chaff', 'sealable container','mushroom spores'],
            'medium',
            '$',
            ['food','green','natural'],
            'Make your own mushrooms at home following this simple process',
             callback);
        },
        function(callback) {
          projectCreate(
            'Cattle Feed',
            ['chaff', 'sealable container','mushroom spores'],
            'medium',
            '$',
            ['food','green','natural'],
            'Make your own mushrooms at home following this simple process',
             callback);
        },
        function(callback) {
          projectCreate(
            'Poultry Bedding',
            ['chaff', 'sealable container','mushroom spores'],
            'medium',
            '$',
            ['food','green','natural'],
            'Make your own mushrooms at home following this simple process',
             callback);
        },
        function(callback) {
          projectCreate(
            'Eco-Bricks',
            ['chaff', 'sealable container','mushroom spores'],
            'medium',
            '$$$',
            ['food','green','natural'],
            'Make your own mushrooms at home following this simple process',
             callback);
        },
        ],
        // optional callback
        cb);
}


async.series([
    addProjects
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Projects: '+projects);

    }
    // All done, disconnect from database
    mongoose.connection.close();
});
