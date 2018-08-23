const passport = require('passport');
const bdPath = require('../bdApiCalls');
const twPath = require('../twitterCalls');
const request = require('request');

var hpaths = require("../conf/herokuSettings");
var urlPath = hpaths.urlPath;

var TwitterStrategy = require('passport-twitter').Strategy;

/**
 * Configuración y acceso mediante la cuenta de Twitter
 */
passport.use(new TwitterStrategy({
    consumerKey: "M4ttQz1CxynrO0lZzXQBeaFF4",
      consumerSecret: "FETpbJhYhcojkJKCKFagZE9LFkVl3vUHR8kKgY3TazC3MgUpre",
      callbackURL: urlPath + "/show/callback",
      userAuthorizationURL: 'https://api.twitter.com/oauth/authenticate?force_login=true',
      includeEmail: true
  },
  function (token, tokenSecret, profile, done) {
    var usuario = {};
    console.log(profile.emails[0].value);
    console.log(token)
    console.log(tokenSecret)
    // var query = {
    //   email: profile.emails[0].value
    // };
    // bdApi.getUsuarios(query,
    //     function (err, res, body) {
    //       if (err) {
    //         console.log(err);
    //         return;
    //       }
    //       console.log("Get response: " + res.statusCode);
    //       if (body.message.length !== 0) {
    //         console.log(body.message);
    //         usuario = body.message[0];
    //         usuario.ultimoAcceso = new Date()
    //         if(usuario.cuentas.indexOf(profile.emails[0].value) === -1){
    //           usuario.cuentas.push({cuentaTwitter: profile.emails[0].value})
    //         }
    //         if(usuario.origen.indexOf(profile.provider) === -1){
    //           usuario.origen.push(profile.provider);
    //           bdApi.putUsuarios(usuario);
    //         }
    //       } else {
    //         usuario.email = profile.emails[0].value;
    //         usuario.nombre = profile.displayName.substr(0,profile.displayName.indexOf(' '));
    //         usuario.apellidos = profile.displayName.substr(profile.displayName.indexOf(' ')+1);
    //         usuario.origen = profile.provider;
    //         usuario.entradaApp = new Date();
    //         usuario.ultimoAcceso = new Date();
    //         usuario.cuentas = [{cuentaTwitter: profile.emails[0].value}]
    //         bdApi.postUsuarios(usuario);
    //       }
    //       return done(null, usuario);
    //     });
  }));

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
            res.send(body.message[0].cuentas)
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
            res.status(200)
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
            res.send(body.message[0].cuentas)
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

module.exports = {
    recover: recover,
    getAcc: getAcc,
    deleteAcc: deleteAcc,
    postAcc: postAcc,
    TWExtract: TWExtract,
    TWCallback: TWCallback
};