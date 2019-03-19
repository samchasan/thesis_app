const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const photoSchema = new Schema(
  {
    name: { type: String },
    data: { type: Buffer },
    contentType: { type: String },
    userId: { type: String }
  });

module.exports = mongoose.model('photos', photoSchema);
