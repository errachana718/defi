var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");

const dbConfig = require('./config/env');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');

var app = express();

//Set up default mongoose connection
const mongoDBUrl = 'mongodb://127.0.0.1:27017/'+dbConfig.mongodb.database;

mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,
  useCreateIndex: true});

//Get the default connection
const db = mongoose.connection;

//CONNECTION EVENTS
//When successfully connected
db.on('connected',function(){
	console.log('Mongoose default connection done')
});

//If the connection  throw an error
db.on('error', function(err){
   console.log('Mongoose default connection error:'+err)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(expressValidator);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
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
});

module.exports = app;
