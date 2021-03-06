const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  phone: { type: String },
  description: { type: String },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  photo: {
    bucket: { type: String },
    key: { type: String },
    location: { type: String },
  },
  location: {
    address: { type: String },
    coordinates: { type: Object },
    hours: { type: Object }
  },
  password: {
    type: String,
    required: true,
  },
  salt: String,
  hash: String,
  isAdmin: { type: Boolean, default: false },
  isBusiness: { type: Boolean, default: false, required: true, },
});

UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});



UserSchema.methods.compare = function (pw) {
  return bcrypt.compareSync(pw, this.password)
}

// //authenticate input against database
// UserSchema.statics.authenticate = function (email, password, callback) {
//   User.findOne({ email: email })
//     .exec(function (err, user) {
//       if (err) {
//         return callback(err)
//       } else if (!user) {
//         const err = new Error('User not found.');
//         err.status = 401;
//         return callback(err);
//       }
//       bcrypt.compare(password, user.password, function (err, result) {
//         if (result === true) {
//           return callback(null, user);
//         } else {
//           return callback();
//         }
//       })
//     });
// }
//
//
// UsersSchema.methods.setPassword = function(password) {
//   this.salt = crypto.randomBytes(16).toString('hex');
//   this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
// };
//
// UsersSchema.methods.validatePassword = function(password) {
//   const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
//   return this.hash === hash;
// };
//
// UsersSchema.methods.generateJWT = function() {
//   const today = new Date();
//   const expirationDate = new Date(today);
//   expirationDate.setDate(today.getDate() + 60);
//
//   return jwt.sign({
//     email: this.email,
//     id: this._id,
//     exp: parseInt(expirationDate.getTime() / 1000, 10),
//   }, 'secret');
// }
//
// UsersSchema.methods.toAuthJSON = function() {
//   return {
//     _id: this._id,
//     email: this.email,
//     token: this.generateJWT(),
//   };
// };

// UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', UserSchema);
module.exports = User;
