const mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Project = new Schema({
  // userID: {type: String},
  title: {type: String},
  materials: {type: Array},
  complexity: {type: String},
  expense: {type: String},
  tags: {type: Array},
  headline: {type: String}
});

Project
.virtual('name')
.get(function () {
  return this.title;
});

Project
.virtual('details')
.get(function () {
  return `DETAILS: materials: ${this.materials}, complexity: ${this.complexity}, distance: ${this.expense}`;
});

Project
.virtual('desc')
.get(function () {
  return this.description;
});

//Export model
module.exports = mongoose.model('Projects', Project);
//
// Roaster.save(function (err) {
//   if (err) return handleError(err);
//   // saved!
// });