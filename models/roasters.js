const mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Roaster = new Schema({
  userID: {type: String},
  name: {type: String},
  address: {type: String},
  coordinates: {type: String},
  phone: {type: String},
  distance: {type: String}
});

Roaster
.virtual('title')
.get(function () {
  return this.name;
});

Roaster
.virtual('location')
.get(function () {
  return this.address + ", " + this.coordinates + "; distance: " + this.dist;
});

Roaster
.virtual('contact')
.get(function () {
  return this.phone;
});

//Export model
module.exports = mongoose.model('Roasters', Roaster);
//
// Roaster.save(function (err) {
//   if (err) return handleError(err);
//   // saved!
// });
