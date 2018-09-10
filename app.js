var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let config = require('./config');

app.use(config.dealImages, express.static(config.dealImageStoreLocation));
app.use(config.productImages, express.static(config.productImagesStoreLocation));
app.use(config.brandImages, express.static(config.brandImagesStoreLocation));
app.use(config.companyImages, express.static(config.companyImagesStoreLocation));
app.use(config.categoryImages, express.static(config.categoryImagesStoreLocation));
app.use(config.ingredientImages, express.static(config.ingredientImagesStoreLocation));
  


app.get('*', function (req, res, next) {
  // Handle angular routing, return all requests to angular app
  if (req.url.startsWith('/api')) {
    //check it is url starts with backend code
    next();
   
  } else {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

require('./routes').attach(app)

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
