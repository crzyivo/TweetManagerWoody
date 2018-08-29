const passport = require('passport');
const bdPath = require('../bdApiCalls');
const twPath = require('../twitterCalls');
const statsApi = require('../statsApiCalls');
const request = require('request');
var TwitterStrategy = require('passport-twitter').Strategy;

var hpaths = require("../conf/herokuSettings");
var urlPath = hpaths.urlPath;

/**
 * Configuración tokens mediante la cuenta de Twitter
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
    bdPath.getUsuarios({email: req.user.email},
        function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.message.length === 0) {
            res.status(400).send("El usuario no existe");
        } else {
            var response = []
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
            }
            res.status(200)
            res.send(response)
        }
    });
};

const TWExtract = passport.authenticate('twitter');

const TWCallback = function (req, res) {
    res.redirect('/frontend/pages/index');
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
                var tweets = [];
                if(!body.errors) {
                    body.forEach(function (tweet) {
                        tweets.push({
                            text: tweet.text,
                            screen_name: tweet.user.screen_name,
                            name: tweet.user.name,
                            img: tweet.user.profile_image_url_https,
                            created: tweet.created_at,
                          retweet_count: tweet.retweet_count,
                          favorite_count:tweet.favorite_count
                        });
                    });
                }
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
                    if(!body.errors) {
                        body.forEach(function (tweet) {
                            tweets.push({
                                text: tweet.text,
                                screen_name: tweet.user.screen_name,
                                name: tweet.user.name,
                                img: tweet.user.profile_image_url_https,
                                created: tweet.created_at,
                              retweet_count: tweet.retweet_count,
                              favorite_count:tweet.favorite_count
                            });
                        });
                    }
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
                    if(!body.errors) {
                        body.forEach(function (tweet) {
                            tweets.push({
                                text: tweet.text,
                                screen_name: tweet.user.screen_name,
                                name: tweet.user.name,
                                img: tweet.user.profile_image_url_https,
                                created: tweet.created_at,
                              retweet_count: tweet.retweet_count,
                              favorite_count:tweet.favorite_count
                            });
                        });
                    }
                    res.status(200);
                    res.send(tweets);
                });
            }
        });
};

const getAccRetweets = function(req,res){
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
          twPath.getReTweets(20,account.token,account.tokenSecret,function (err,resTw,body) {
            var tweets = [];
            if(!body.errors) {
              body.forEach(function (tweet) {
                tweets.push({
                  text: tweet.text,
                  screen_name: tweet.user.screen_name,
                  name: tweet.user.name,
                  img: tweet.user.profile_image_url_https,
                  created: tweet.created_at,
                  retweet_count: tweet.retweet_count,
                  favorite_count:tweet.favorite_count
                });
              });
            }
            res.status(200);
            res.send(tweets);
          });
        }
      });
};

const getAccFavs = function(req,res){
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
          twPath.getUserTweets(account.account_name,50,account.token,account.tokenSecret,function (err,resTw,body) {
            var count=20;
            var tweets = [];
            if(!body.errors) {
              body.forEach(function (tweet) {
                  if(parseInt(tweet.favorite_count)!==0) {
                    tweets.push({
                      text: tweet.text,
                      screen_name: tweet.user.screen_name,
                      name: tweet.user.name,
                      img: tweet.user.profile_image_url_https,
                      created: tweet.created_at,
                      retweet_count: tweet.retweet_count,
                      favorite_count: tweet.favorite_count
                    });
                  }
              });
            }
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
                console.log(err);
                res.status(500);
                res.send(err);
            }
            if (body.error) {
                res.status(400).send("La cuenta no existe");
            } else {
                var account = body.message;
                twPath.postTweet(req.body.text,account.token,account.tokenSecret,function (err,resTw,body) {
                    if(err){
                        console.log(err);
                        res.status(500);
                        res.send(err);
                    }else {
                        var tweet = {
                            id: "",
                            account_name: account.account_name,
                            location: {
                                lat: "0",
                                long: "0"
                            },
                            fecha: new Date(body.created_at),
                            tweetLength: body.text.length
                        };
                        bdPath.getUsuarios({email: req.params.user}, function(err, redBd, bod){
                            if (err) {
                                console.log(err);
                                res.status(500);
                                res.send(err);
                            }
                            if (body.error) {
                                console.log('meeeeeh');
                                res.status(400).send("La cuenta no existe");
                            } else {
                                console.log("llego aqui de verdad")
                                tweet.id = bod.message[0]._id
                                statsApi.addTwitStats(tweet)
                            }
                            res.status(200);
                            res.send(body);
                        })
                    }
                });
            }
        });
};

const postUrlShorten = function(req,res){
    console.log(req.body)
    bdPath.postUrl({ "originalUrl": req.body.originalUrl, "shortBaseUrl": hpaths.bdPath+'/url/item' },
        function (err, resBd, body) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            }
            if (body.error) {
                console.log('meeeeeh');
                res.status(400).send("La cuenta no existe");
            } else {
                res.status(200);
                res.send(body);
            }
        });
};


const sendProgTweet = function (req,res) {
    twPath.postTweet(req.body.text,req.body.token,req.body.tokenSecret,function (err,resTw,body) {
        if(err){
            console.log(err);
            res.status(500);
            res.send(err);
        }else {
            var tweet = {
                id: "",
                account_name: account.account_name,
                location: {
                    lat: 0,
                    long: 0
                },
                time: body.created_at,
                tweetLength: body.text.length
            };
            bdPath.getUsuarios({email: req.params.user}, function(err, redBd, bod){
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.send(err);
                }
                if (body.error) {
                    console.log('meeeeeh');
                    res.status(400).send("La cuenta no existe");
                } else {
                    tweet.id = bod.message[0]._id
                    statsApi.addTwitStats(tweet)
                }
                res.status(200);
                res.send(body);
            })
        }
    });
}

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

const postAccHashtag = function(req,res){
    bdPath.postHashtag({email: req.params.user, cuenta: req.params.account, hashtags:req.body.hashtags},
        function (err, resBd, body) {
            if (err) {
                res.status(500);
                res.send(err);
            }
            if (body.message.length === 0 || body.error) {
              res.send([]);
            } else {
                res.status(200);
                res.send(body.message);
            }
        });
};

const getAccHashtag = function(req,res){
    console.log(req.params);
    bdPath.getHashtag({email: req.params.user, cuenta: req.params.account},
        function (err, resBd, body) {
        console.log(body)
            if (err) {
                res.status(500);
                res.send(err);
            }
            if (body.message.length === 0 || body.error) {
              res.send([]);
            } else {
                res.status(200);
                res.send(body.message);
            }
        });
};

const deleteAccHashtag = function(req,res){
    bdPath.deleteHashtag({email: req.params.user, cuenta: req.params.account, hashtag:req.query.hashtag},
        function (err, resBd, body) {
            if (err) {
                res.status(500);
                res.send(err);
            }
            if (body.message.length === 0 || body.error) {
                res.send([]);
            } else {
                res.status(200);
                res.send(body.message);
            }
        });
};

const getTokens = passport.authenticate('twitterToken',{prompt: 'select_account'});
const getTokensCallback = function (req, res) {
  console.log('callback babyyy');
  res.redirect('/frontend/perfil.html');
};

const getProgramados = function(req,res){
    var query={
        email: req.params.user,
        cuenta: req.params.account
    };
    bdPath.getProgramados(query,function (err,resTw,body) {
        var tweets = [];
        var clock_img = 'https://png.icons8.com/ios/50/000000/watch.png';
        body.message.forEach(function (tweet) {
            tweets.push({
                text: tweet.text,
                screen_name: tweet.cuenta,
                name: tweet.public_name,
                created: tweet.trigger,
                img:clock_img
            });
        });
        res.status(200);
        res.send(tweets);
    });
};

const postProgramados = function(req,res){
    var body = {
        text:req.body.text,
        trigger:req.body.trigger,
        public_name:req.body.public_name,
        usuario:req.params.user,
        cuenta:req.params.account
    };
    bdPath.postProgramados(body,function (err, resBd, body) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        if (body.error) {
            res.status(400).send("La cuenta no existe");
        } else {
            res.status(200);
            res.send(body);
        }
    });
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
    postAccTweet:postAccTweet,
    getProgramados: getProgramados,
    postProgramados: postProgramados,
    sendProgTweet: sendProgTweet,
    getAccRetweets: getAccRetweets,
    getAccFavs:getAccFavs,
    postUrlShorten: postUrlShorten,
    postAccHashtag: postAccHashtag,
    getAccHashtag: getAccHashtag,
    deleteAccHashtag: deleteAccHashtag

};