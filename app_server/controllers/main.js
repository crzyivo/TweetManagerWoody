const passport = require('passport');
const request = require('request');
const bdApi = require('../bdApiCalls');
var hpaths = require("../conf/herokuSettings");
const bcrypt = require('bcrypt');
var bdPath = hpaths.bdPath;
var urlPath = hpaths.urlPath;
console.log(bdPath);

var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;

/**
 * Acceso mediante login normal
 */
passport.use(new LocalStrategy(function (username,password,done) {
  var usuario = {};
  var query = {
    email: username
  };
  bdApi.getUsuarios(query, function (err,res,body) {
    if(err){return done(err);}
    if(body.message.length === 0){
      console.log("No existe el usuario");
      return done(null,false,{message: "Error en las crendenciales"});
    }else {
      usuario = body.message[0];
      if(usuario.origen.indexOf("local") === -1){
        usuario.origen.push("local")
      }
      bcrypt.compare(password,usuario.password).then(function (res) {
        if (!res) {
          console.log("contraseña invalida");
          console.log(password);
          console.log(usuario);
          return done(null, false, {message: "Error en las crendenciales"});
        }
        console.log("Login OK");
        usuario.ultimoAcceso = new Date();
        bdApi.putUsuarios(usuario);
        return done(null,usuario);
      });
    }});
}));

const login = passport.authenticate('local');

const  loginCallback = function(req,res){
  console.log(req.user);
  var response = {};
  if(req.user.primerAcceso){
    response.next = '/firstLogin';
  }else{
    response.next = '/frontend/pages/index';
  }
  if(req.user.admin){
    response.next = '/frontend/pages/adminSPA';
  }
  response.username = req.user.email;
  res.json(response);

};

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
      console.log('Profile: '+profile.emails[0].value);
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
              usuario.ultimoAcceso = new Date()
              if(usuario.origen.indexOf(profile.provider) === -1) {
                usuario.origen.push(profile.provider);
                bdApi.putUsuarios(usuario);

              }
            } else {
              usuario.email = profile.emails[0].value;
              usuario.nombre = profile.name.givenName
              usuario.apellidos = profile.name.familyName
              usuario.origen = profile.provider;
              usuario.entradaApp = new Date();
              usuario.ultimoAcceso = new Date();
              bdApi.postUsuarios(usuario);
            }
            return done(null, usuario);
          });

    }));

const loginGoogle = passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'],
  prompt: 'select_account',
  failureRedirect: '/'
});

const loginGoogleCallback = function (req, res) {
    res.redirect('/frontend/pages/index/');
};

/**
 * Configuracion y acceso mediante la cuenta de Facebook
 */
passport.use(new FacebookStrategy({
        clientID: "248940799181481",
        clientSecret: "4507bf08d0818017acbb26fc4aeda0fc",
        callbackURL: urlPath + "/loginFacebook/callback",
        profileFields: ['id', 'emails', 'name']
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
                    usuario.ultimoAcceso = new Date()
                    if(usuario.origen.indexOf(profile.provider) === -1) {
                        usuario.origen.push(profile.provider);
                        bdApi.putUsuarios(usuario);
                    }
                } else {
                  usuario.email = profile.emails[0].value;
                  usuario.nombre = profile.name.givenName
                  usuario.apellidos = profile.name.familyName
                  usuario.origen = profile.provider;
                  usuario.entradaApp = new Date();
                  usuario.ultimoAcceso = new Date();
                  bdApi.postUsuarios(usuario);
                }
                return done(null, usuario);
            });
    }));

const loginFacebook = passport.authenticate('facebook', { scope : ['email'] ,failureRedirect:'/'});

const loginFacebookCallback = function (req, res) {
    res.redirect('/frontend/pages/index');
};

/**
 * Configuración y acceso mediante la cuenta de Twitter
 */
passport.use(new TwitterStrategy({
      consumerKey: "M4ttQz1CxynrO0lZzXQBeaFF4",
      consumerSecret: "FETpbJhYhcojkJKCKFagZE9LFkVl3vUHR8kKgY3TazC3MgUpre",
      callbackURL: urlPath + "/loginTwitter/callback",
      userAuthorizationURL: 'https://api.twitter.com/oauth/authenticate?force_login=true',
      includeEmail: true,

    },
    function (token, tokenSecret, profile, done) {
      var usuario = {};
      console.log(profile);
      console.log(token)
      console.log(tokenSecret)
      console.log()
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
              usuario.ultimoAcceso = new Date()
              if(usuario.origen.indexOf(profile.provider) === -1){
                usuario.origen.push(profile.provider);
                bdApi.putUsuarios(usuario);
              }
            } else {
              usuario.email = profile.emails[0].value;
              usuario.nombre = profile.displayName.substr(0,profile.displayName.indexOf(' '));
              usuario.apellidos = profile.displayName.substr(profile.displayName.indexOf(' ')+1);
              usuario.origen = profile.provider;
              usuario.entradaApp = new Date();
              usuario.ultimoAcceso = new Date();
              bdApi.postUsuarios(usuario);
            }
            return done(null, usuario);
          });
    }));

const loginTwitter = passport.authenticate('twitter',{prompt: 'select_account'});
const loginTwitterCallback = function (req, res) {
  res.redirect('/frontend/pages/index');
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
 * Devuelve el usuario que ha iniciado sesión, para ser almacenado en el navegador
 * @param req
 * @param res
 */
const session = function (req,res) {
    if(req.cookies.user_sid) {
        res.json({user: req.user.email});
    }
};
/**
 * Control de sesión al acceder a root
 * @param req
 * @param res
 */
const index = function(req, res){
  if(req.cookies.user_sid){
    console.log("sesion ya iniciada");
    response = '/frontend/pages/index'
    // if(req.user.admin){
    //   response = '/frontend/pages/indexAdminSPA';  Aquí no entrará porque administrador no viaja a URLs desconocidas al ser SPA
    // }
    res.redirect(response);
  }else{
    console.log("inicia sesion pls");
    res.redirect('/index');
  }
};

/**
 * Salida de la sesión del usuario, borramos la cookie de sesión
 * @param req
 * @param res
 */
const logout = function(req, res){
  console.log(req.body);
  if(req.cookies.user_sid){
    res.clearCookie('user_sid');
  }
  res.redirect('/');
};


module.exports = {
    loginFacebook: loginFacebook,
    loginFacebookCallback: loginFacebookCallback,
    loginGoogle: loginGoogle,
    loginGoogleCallback: loginGoogleCallback,
    loginTwitter: loginTwitter,
    loginTwitterCallback: loginTwitterCallback,
    index: index,
    logout: logout,
    login: login,
    loginCallback: loginCallback,
    session: session
};