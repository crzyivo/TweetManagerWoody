const bdPath = require('../bdApiCalls');
const twPath = require('../twitterCalls');
const request = require('request');

var hpaths = require("../conf/herokuSettings");
var twpaths = require("../conf/twitterSettings");
var urlPath = hpaths.urlPath;
var oauth = require('oauth')


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

const TWPrueba = function(req,res){
    var username = req.params.user.toString();
    console.log(username)
    console.log(twpaths.twitterKeys.consumer_key)
    console.log(twpaths.twitterKeys.consumer_secret)
    console.log(urlPath)
    var consumer = new oauth.Oauth(
        "https://twitter.com/oauth/request_token",
        "https://twitter.com/oauth/access_token",
        twpaths.twitterKeys.consumer_key, twpaths.twitterKeys.consumer_secret, "1.0A", urlPath + "/acc/show/callback/"+ encodeURIComponent(username), "HMAC-SHA1");
    console.log("y aqui")
    consumer.getOAuthRequestToken(
        function(error, oauthToken, oauthTokenSecret, results){
            if (error) {
                console.log(error)
                return res.status(500).json({message: 'Error getting OAuth Request Token.'});
        } else {
            console.log("llego aqui")
            req.session.oauthRequestToken = oauthToken;
            req.session.oauthRequestTokenSecret = oauthTokenSecret;
            console.log("outrequest"+twpaths.twitterKeys.consumer_key);
            console.log(req.session)
            res.redirect("https://api.twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
            console.log( 'get sessions connect' );
        }
    });
};

var tAPI = "https://api.twitter.com/1.1/account/verify_credentials.json";

const TWPrueba2 = function(req,res){
  var username = req.params.username;
  console.log(">>"+req.session.oauthRequestToken);
  console.log(">>"+req.session.oauthRequestTokenSecret);
  console.log(">>"+req.query.oauth_verifier);

  var consumer = new oauth.OAuth(
      "https://twitter.com/oauth/request_token",
      "https://twitter.com/oauth/access_token",
      twpaths.twitterKeys.consumer_key, twpaths.twitterKeys.consumer_secret, "1.0A", urlPath + "/frontend/pages/indexUser", "HMAC-SHA1");
  consumer.getOAuthAccessToken( req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier,
    function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      console.log("ARRIBA");
      return res.redirect('https://tweetrmanager.herokuapp.com/#/home');
    } else {
      console.log("REEEEEEQ ");
      console.log("ABAJO")
      console.log(username)
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

      console.log(req.session.oauthAccessToken);
      console.log(req.session.oauthAccessTokenSecret);
      console.log( 'get sessions callback' );
      //res.send(results);

      consumer.get(tAPI, req.session.oauthAccessToken,
                   req.session.oauthAccessTokenSecret,
                   function (error, data, response) {
        if (error) {
            console.log( 'error\n' );
            console.log( error );
            res.redirect('https://tweetrmanager.herokuapp.com/#/errorAddingAccount');
        } else {
            var parsedData = JSON.parse(data);
            console.log("PARSED DATA")
            console.log( parsedData );
            var idStr = parsedData.id_str;
            var screen_name = parsedData.screen_name;
            var title = parsedData.name;
            var description = parsedData.description;
            var image = parsedData.profile_image_url_https;

            Account.findOne({'username': username, 'idStr': idStr}, function(err, acc, next) {
              if (err) {
                res.redirect('https://tweetrmanager.herokuapp.com/#/errorAddingAccount');
              } else {
                if (acc == null) {
                  var cuenta = new Account();
                  cuenta.username = username;
                  cuenta.idStr = idStr;
                  cuenta.screenName = screen_name;
                  cuenta.token = req.session.oauthAccessToken;
                  cuenta.token_secret = req.session.oauthAccessTokenSecret;
                  cuenta.title = title;
                  cuenta.image = image;
                  cuenta.desc = description;
                  cuenta.save();
                  res.redirect('https://tweetrmanager.herokuapp.com/#/home');
                } else {
                  res.redirect('https://tweetrmanager.herokuapp.com/#/home');
                }
              }
            });
        }
      });
    }
  });
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
    TWPrueba: TWPrueba,
    TWPrueba2: TWPrueba2
};