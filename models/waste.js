const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const Waste = new Schema({
  userID: { type: String },
  username: { type: String },
  title: { type: String },
  material: { type: String },
  location: {
    address: { type: String },
    coordinates: { type: Object }
  },
  photo: {
    bucket: { type: String },
    key: { type: String },
    url: { type: String },
  },
  frequency: {
    category: '',
    moment: ''
  },
  amount: { type: Number },
  description: { type: String },
  homogenous: { type: Boolean },
  headline: { type: String }
});

Waste
  .virtual('name')
  .get(function () {
    return this.title;
  });

Waste
  .virtual('details')
  .get(function () {
    return `DETAILS: material: ${this.material}, complexity: ${this.complexity}, distance: ${this.expense}`;
  });

Waste
  .virtual('desc')
  .get(function () {
    return this.description;
  });

//Export model
module.exports = mongoose.model('Waste', Waste);
