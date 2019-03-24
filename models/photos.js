const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const photoSchema = new Schema(
  {
    name: { type: String },
    newName: { type: String },
    category: {
      parent: { type: String },
      child: { type: String }
    },
    img: {
      data: { type: Buffer },
      contentType: { type: String }
    },
    userId: { type: String }
  });

module.exports = mongoose.model('photos', photoSchema);


// CATEGORIES: 
// Parent: Waste, Project, Avatar
// Child: WasteName, ProjectName, AvatarName
