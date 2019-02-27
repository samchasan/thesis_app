#! /usr/bin/env node

console.log('This script populates some test roasters in my database');

// Get arguments passed on command line
// var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Roaster = require('./models/roasters')

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://root:1Ab029384756@ChaffMap-ljx1a.mongodb.net/Chaff_Map?retryWrites=true';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var roasters = []

function roasterCreate(name, address, coords, phone, dist, cb) {
  roasterdetail = {name:name , address: address, coordinates: coords, phone: phone, distance: dist}

  var roaster = new Roaster(roasterdetail);

  roaster.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Roaster: ' + roaster);
    roasters.push(roaster)
    cb(null, roaster)
  }  );
}

function addRoasters(cb) {
    async.parallel([
        function(callback) {
          roasterCreate('North Star Coffee', '101 Lenox Rd', '75.1, 40.2', '999-000-8888', '1 mi', callback);
        },
        function(callback) {
          roasterCreate('North Five Roaster', '101 Lenox Rd', '75.1, 40.2', '999-000-8888', '1 mi', callback);
        },
        function(callback) {
          roasterCreate('Number Star Locale', '101 Lenox Rd', '75.1, 40.2', '999-000-8888', '1 mi', callback);
        },
        function(callback) {
          roasterCreate('Five Bright Coffee', '101 Lenox Rd', '75.1, 40.2', '999-000-8888', '1 mi', callback);
        },
        function(callback) {
          roasterCreate('Bright Star Cafe', '101 Lenox Rd', '75.1, 40.2', '999-000-8888', '1 mi', callback);
        },
        ],
        // optional callback
        cb);
}


async.series([
    addRoasters
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+roasters);

    }
    // All done, disconnect from database
    mongoose.connection.close();
});
