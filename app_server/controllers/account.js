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
                'description': cuenta.description,
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
            var response = []
            console.log(body)
            if(body.message[0].cuentas !== undefined){
                var cuentas = body.message[0].cuentas;
                Object.keys(cuentas).forEach(function (key) {
                  console.log(cuentas[key]);
                  response.push({
                    account_name:cuentas[key].account_name,
                    email:cuentas[key].email,
                    public_name:cuentas[key].public_name,
                    description:cuentas[key].description
                  })
                });
              console.log(response);
            }
            res.status(200)
            res.send(response)
        }
    });
};

const TWExtract = passport.authenticate('twitter');

const TWCallback = function (req, res) {
    res.redirect('/frontend/pages/indexUser');
};

const getAcc = function(req,res){
    bdPath.getAccount({email: req.params.user, account: req.params.account },
        function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.error) {
            res.status(400).send("La cuenta no existe");
        } else {
            var account = body.message;
            twPath.getHome(20,account.token,account.tokenSecret,function (err,resTw,body) {
                console.log(body)
                var tweets = [];
                body.forEach(function (tweet) {
                    tweets.push({
                        text:tweet.text,
                        screen_name:tweet.user.screen_name,
                        name:tweet.user.name,
                        img:tweet.user.profile_image_url_https,
                        created:tweet.created_at
                    });
                });
                res.status(200);
                res.send(tweets);
            });
        }
    });
};

const getAccUser = function(req,res){
    bdPath.getAccount({email: req.params.user, account: req.params.account },
        function (err, resBd, body) {
            if (err) {
                res.status(500);
                res.send(err);
            }
            if (body.error) {
                res.status(400).send("La cuenta no existe");
            } else {
                var account = body.message;
                twPath.getUserTweets(account.account_name,20,account.token,account.tokenSecret,function (err,resTw,body) {
                    var tweets = [];
                    body.forEach(function (tweet) {
                        tweets.push({
                            text:tweet.text,
                            screen_name:tweet.user.screen_name,
                            name:tweet.user.name,
                            img:tweet.user.profile_image_url_https,
                            created:tweet.created_at
                        });
                    });
                    res.status(200);
                    res.send(tweets);
                });
            }
        });
};

const getAccMentions = function(req,res){
    bdPath.getAccount({email: req.params.user, account: req.params.account },
        function (err, resBd, body) {
            if (err) {
                res.status(500);
                res.send(err);
            }
            if (body.error) {
                res.status(400).send("La cuenta no existe");
            } else {
                var account = body.message;
                twPath.getUserMentions(20,account.token,account.tokenSecret,function (err,resTw,body) {
                    var tweets = [];
                    body.forEach(function (tweet) {
                        tweets.push({
                            text:tweet.text,
                            screen_name:tweet.user.screen_name,
                            name:tweet.user.name,
                            img:tweet.user.profile_image_url_https,
                            created:tweet.created_at
                        });
                    });
                    res.status(200);
                    res.send(tweets);
                });
            }
        });
};

const postAccTweet = function(req,res){
    bdPath.getAccount({email: req.params.user, account: req.params.account },
        function (err, resBd, body) {
            if (err) {
                res.status(500);
                res.send(err);
            }
            if (body.error) {
                res.status(400).send("La cuenta no existe");
            } else {
                var account = body.message;
                twPath.postTweet(req.body.text,account.token,account.tokenSecret,function (err,resTw,body) {
                    var tweets = [];
                    res.status(200);
                    res.send(body);
                });
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
            var response = []
            console.log(body)
            if(body.message[0].cuentas !== undefined){
                var cuentas = body.message[0].cuentas;
                Object.keys(cuentas).forEach(function (key) {
                  console.log(cuentas[key]);
                  response.push({
                    account_name:cuentas[key].account_name,
                    email:cuentas[key].email,
                    public_name:cuentas[key].public_name,
                    description:cuentas[key].description
                  })
                });
              console.log(response);
            }
            res.status(200)
            res.send(response)
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
            var response = []
            console.log(body)
            if(body.message[0].cuentas !== undefined){
                var cuentas = body.message[0].cuentas;
                Object.keys(cuentas).forEach(function (key) {
                  console.log(cuentas[key]);
                  response.push({
                    account_name:cuentas[key].account_name,
                    email:cuentas[key].email,
                    public_name:cuentas[key].public_name,
                    description:cuentas[key].description
                  })
                });
              console.log(response);
            }
            res.status(200)
            res.send(response)
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
    getTokensCallback: getTokensCallback,
    getAccUser: getAccUser,
    getAccMentions: getAccMentions,
    postAccTweet:postAccTweet
};