const passport = require('passport');
const request = require('request');
var bdPath = require("../../bin/bdSettings").bdPath;
console.log(bdPath);

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
      clientID: "798313746266-ds9o88dnpa0b1r60hbiqn33fqq5o5ree.apps.googleusercontent.com",
      clientSecret:"KypPKTK7K8yZD43sVcWjxl1a",
      callbackURL: "http://localhost:3000/loginGoogle/callback",
    },
    function(token, tokenSecret, profile, done) {
      var usuario = {};
      console.log(profile.emails[0].value);
      request.get({
            baseUrl: bdPath,
            uri: "/users",
            qs: {
              origen: profile.provider,
              email: profile.emails[0].value
            },
            json:true
          },
          function(err, res, body) {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Get response: " + res.statusCode);
            if (body.message.length !== 0) {
              console.log(body.message);
              usuario = body.message;
            }else {
              usuario.email = profile.emails[0].value;
              usuario.origen = profile.provider;
              request.post({
                baseUrl: bdPath,
                uri: "/users",
                json: true,
                body: usuario
              });
            }
          });
      console.log(profile.id);
      return done(null,usuario);
    }));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const loginGoogle = passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'],
  faliureRedirect:'/' });

const  loginGoogleCallback = function(req,res){
  res.redirect('/frontend/index.html');
};
module.exports = {
    loginGoogle:loginGoogle,
    loginGoogleCallback:loginGoogleCallback
};