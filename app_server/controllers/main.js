const passport = require('passport');
const request = require('request');
const bdApi = require('../../bin/bdApiCalls');
var hpaths = require("../../bin/herokuSettings");
var bdPath = hpaths.bdPath;
var urlPath = hpaths.urlPath;
console.log(bdPath);

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

/**
 * Configuración y callback del acceso mediante la cuenta de Google
 */
passport.use(new GoogleStrategy({
      clientID: "798313746266-ds9o88dnpa0b1r60hbiqn33fqq5o5ree.apps.googleusercontent.com",
      clientSecret: "KypPKTK7K8yZD43sVcWjxl1a",
      callbackURL: urlPath + "/loginGoogle/callback",
    },
    function (token, tokenSecret, profile, done) {
      var usuario = {};
      console.log(profile.emails[0].value);
      var query = {
        email: profile.emails[0].value
      };
      bdApi.getUsuarios(query,
          function (err, res, body) {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Get response: " + res.statusCode);
            if (body.message.length !== 0) {
              console.log(body.message);
              usuario = body.message[0];
              if(usuario.origen.indexOf(profile.provider) === -1) {
                usuario.origen.push(profile.provider);
                bdApi.putUsuarios(usuario);
              }
            } else {
              usuario.email = profile.emails[0].value;
              usuario.origen = profile.provider;
              bdApi.postUsuarios(usuario);
            }
          });
      console.log(profile.id);
      return done(null, usuario);
    }));

const loginGoogle = passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'],
  failureRedirect: '/'
});

const loginGoogleCallback = function (req, res) {
  res.redirect('/frontend/index.html');
};

/**
 * Configuración y acceso mediante la cuenta de Twitter
 */
passport.use(new TwitterStrategy({
      consumerKey: "M4ttQz1CxynrO0lZzXQBeaFF4",
      consumerSecret: "FETpbJhYhcojkJKCKFagZE9LFkVl3vUHR8kKgY3TazC3MgUpre",
      callbackURL: urlPath + "/loginTwitter/callback",
      includeEmail: true
    },
    function (token, tokenSecret, profile, done) {
      var usuario = {};
      console.log(profile.emails[0].value);
      var query = {
        email: profile.emails[0].value
      };
      bdApi.getUsuarios(query,
          function (err, res, body) {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Get response: " + res.statusCode);
            if (body.message.length !== 0) {
              console.log(body.message);
              usuario = body.message[0];
              if(usuario.origen.indexOf(profile.provider) === -1){
                usuario.origen.push(profile.provider);
                bdApi.putUsuarios(usuario);
              }
            } else {
              usuario.email = profile.emails[0].value;
              usuario.origen = profile.provider;
              bdApi.postUsuarios(usuario);
            }
          });
      console.log(profile.id);
      return done(null, usuario);
    }));

const loginTwitter = passport.authenticate('twitter');

const loginTwitterCallback = function (req, res) {
  res.redirect('/frontend/index');
};

/**
 * Uso de sesiones con passport
 */
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

/**
 * Control de sesión al acceder a root
 * @param req
 * @param res
 */
const index = function(req, res){
  if(req.cookies.user_sid){
    console.log("sesion ya iniciada");
    res.redirect('/frontend/index');
  }else {
    console.log("inicia sesion pls");
    res.redirect('index.html');
  }
};

/**
 * Salida de la sesión del usuario, borramos la cookie de sesión
 * @param req
 * @param res
 */
const logout = function(req, res){
  if(req.cookies.user_sid){
    res.clearCookie('user_sid');
    res.redirect('/');
  }
};


module.exports = {
  loginGoogle: loginGoogle,
  loginGoogleCallback: loginGoogleCallback,
  loginTwitter: loginTwitter,
  loginTwitterCallback: loginTwitterCallback,
  index: index,
  logout: logout
};