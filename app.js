var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session')
var logger = require('morgan');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var indexRouter = require('./routes/index');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site
var dataRouter = require('./routes/data');  //Import routes for "catalog" area of site
var compression = require('compression');
const yelp = require('yelp-fusion');
const apiKey = 'wGqzd3D0HanzPEzCzsL6564joQ193ruYklVwN3si1zfkH6tQfsUnYHyOaMSmF4Qlz3kcnweFNGRcukXCcuvaJ_9MOw-1PfHc2Ql1BR-hXXv5cevs43CgmZVgiTpxXHYx';
const uuid = require('uuid/v4')
const uniqueID = uuid()
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');


// timeout in seconds
const timeout = 2 * 60


// setTimeout(function(){
//   db.dropDatabase(uniqueID)
// }, timeout)

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression()); //Compress all routes
app.use(logger('dev'))


app.use(session({
  secret: 'aflhufiuladjioasklasd',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore ({mongooseConnection: mongoose.connection,
                          ttl: timeout })
}))
app.use(require('flash')());

app.use(bodyParser.urlencoded({extended:true}))


app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);
app.use('/data', dataRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  const sessionID = req.session
  // console.log(sessionID)
  	// console.log("===================");
	// console.log(req.user);
	next();
});


module.exports = app;
