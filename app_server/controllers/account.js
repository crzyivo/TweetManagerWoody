const passport = require('passport');
const bdPath = require('../bdApiCalls');
const twPath = require('../twitterCalls');
const request = require('request');
var TwitterStrategy = require('passport-twitter').Strategy;

var hpaths = require("../conf/herokuSettings");
var urlPath = hpaths.urlPath;

/**
 * Configuración y acceso mediante la cuenta de Twitter
 */
function createStrategy(){
  var strategy = new TwitterStrategy({
        consumerKey: "M4ttQz1CxynrO0lZzXQBeaFF4",
        consumerSecret: "FETpbJhYhcojkJKCKFagZE9LFkVl3vUHR8kKgY3TazC3MgUpre",
        callbackURL: urlPath + "/acc/tokens/callback",
        userAuthorizationURL: 'https://api.twitter.com/oauth/authenticate?force_login=true',
        includeEmail: true,
        passReqToCallback: true
      },
      function (req,token, tokenSecret, profile, done) {
        var usuario = req.user;
        var cuenta = profile._json;
        console.log(req.user);
        console.log(profile._json);
        //Si la cuenta ya esta asociada al usuario, mongoose no hara cambios
            var cuenta_json = {
                'cuenta': cuenta.screen_name,
                'email':usuario.email,
                'account_email':cuenta.email,
                'public_name':cuenta.name,
                'token':token,
                'tokenSecret':tokenSecret
            };
            bdPath.postAccount(cuenta_json);
        return done(null,usuario);
      });
  strategy.name = 'twitterToken';
  return strategy;
}
passport.use('twitterToken',createStrategy());

const recover = function(req,res){
    console.log(req.query.email)
    bdPath.getUsuarios({email: req.query.email},
        function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.message.length === 0) {
            res.status(400).send("El usuario no existe");
        } else {
            var response = {}
            response.cuentas = body.message.cuentas;
            res.status(200)
            res.send(Object.keys(body.message[0].cuentas))
        }
    });
};

const TWprueba = function(req,res){
    twPath.getAcc(req.query.email)
};

const TWExtract = passport.authenticate('twitter');

const TWCallback = function (req, res) {
    res.redirect('/frontend/pages/indexUser');
};

const getAcc = function(req,res){
    bdPath.getAccount({email: req.params.user, account: req.params.email },
        function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.message.length === 0) {
            res.status(400).send("La cuenta no existe");
        } else {
            res.status(200);
            res.send(body.message[0])
        }
    });
};

const deleteAcc = function(req,res){
    bdPath.deleteAccount({email: req.body.params.email, account: req.body.params.acc},
        function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.message.length === 0) {
            res.status(400).send("El usuario no existe");
        } else {
            res.status(200)
            res.send(Object.keys(body.message[0].cuentas))
        }
    });
};

const postAcc = function(req,res){
    bdPath.postAccount({email: req.body.params.email, account: req.body.params.acc},
        function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.message.length === 0) {
            res.status(400).send("El usuario no existe");
        } else {
            res.status(200)
            res.send(body.message[0].cuentas)
        }
    });
};

const getTokens = passport.authenticate('twitterToken',{prompt: 'select_account'});
const getTokensCallback = function (req, res) {
  console.log('callback babyyy');
  res.redirect('/frontend/perfil.html');
};

module.exports = {
    recover: recover,
    getAcc: getAcc,
    deleteAcc: deleteAcc,
    postAcc: postAcc,
    TWExtract: TWExtract,
    TWCallback: TWCallback,
    getTokens: getTokens,
    getTokensCallback: getTokensCallback
};