const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const photoSchema = new Schema(
  {
    name: { type: String },
    category: { type: String },
    url: { type: String },
    userID: { type: String },
    username: { type: String }
  });

module.exports = mongoose.model('photos', photoSchema);


// CATEGORIES: 
// Parent: Waste, Project, Avatar
// Child: WasteName, ProjectName, AvatarName
