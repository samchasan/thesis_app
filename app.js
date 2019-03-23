// require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const multer = require('multer')
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session')
const logger = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog');  // Import routes for "catalog" area of site
const dataRouter = require('./routes/data');  // Import routes for "catalog" area of site
const compression = require('compression');
const uuid = require('uuid/v4')
const uniqueID = uuid()
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');
const fileUpload = require('express-fileupload');

// timeout in seconds
const timeout = 2 * 60
const configDB = require('./config/database.js');
mongoose.connect(configDB.url);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// serve everything in "dist" from "js" folder
app.use('/js', express.static(path.join(__dirname, 'dist')));
app.use(cookieParser())
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(fileUpload());
app.use(compression());  // Compress all routes
app.use(logger('dev'))

app.use(session({
  secret: 'aflhufiuladjioasklasd',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: timeout, useNewUrlParser: true })
}))
app.use(require('flash')());

app.use(bodyParser.urlencoded({ extended: true }))


app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);
app.use('/data', dataRouter);


app.use((req, res, next) => {
  next(createError(404));
});


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  const sessionID = req.session

  next();
});


module.exports = app;
