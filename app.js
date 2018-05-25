var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
const herokuSettings = require('./app_server/conf/herokuSettings');
const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname,'app_server', 'views'));
app.set('view engine', 'pug');
app.use(session({
  name: "user_sid",
  secret: "HayUnaSerpienteEnMiBota",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public'),{extensions :['html'],index: false}));

if(herokuSettings.entorno !== 'heroku') {
  app.use('*', function (req, res, next) {
    if (req.secure) {
      console.log("secured");
      next();
    } else {
      console.log("not secured");
      res.redirect(herokuSettings.urlPath + req.url);
    }
  });
}

app.use('/users', usersRouter);
app.use('/', indexRouter); //Esto siempre el último


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
