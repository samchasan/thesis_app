const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const Roaster = new Schema({
  userID: {type: String},
  name: {type: String},
  address: {type: String},
  coordinates: {type: Object},
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
module.exports = mongoose.model('Roaster', Roaster);
