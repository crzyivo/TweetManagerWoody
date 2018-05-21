const passport = require('passport');
const request = require('request');
var app = require('../../app');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
      clientID: "798313746266-ds9o88dnpa0b1r60hbiqn33fqq5o5ree.apps.googleusercontent.com",
      clientSecret:"KypPKTK7K8yZD43sVcWjxl1a",
      callbackURL: "http://localhost:3000/frontend/index.html",
    },
    function(token, tokenSecret, profile, done) {
      var usuario = {};
      request.get({
            uri: app.get('dbPath'),
            baseUrl: "/users",
            qs: {
              origen: "google",
              email: profile.id
            }
          },
          function (err, res, body) {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Get response: " + res.statusCode);
            if (body) {
              usuario = body;
            }
          });
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      console.log(profile.id);
      return done(null,usuario);
    }));

const loginGoogle = passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'],
  faliureRedirect:'/' });

module.exports = {
    loginGoogle
};