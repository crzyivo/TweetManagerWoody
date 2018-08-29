var mongoose = require('mongoose');
const UserStats = require('../models/userStats');


const postStat = function (req,res) {
  console.log("imprimo nuevo user")
  console.log(req.body);
  var newStat = new UserStats(
      {
          idCuenta: req.body.id,
          email: req.body.email,
          numTweets: 0,
          tweets: [],
          fechaAlta: req.body.fecha,
          fechaBaja: null,
          numAccess: 0
      });
  var response = {};
  newStat.save()
  .then((newStat) => {
    response = {"error" : false,"message" : "Stat has been added!"};
        //console.log(newStat);
        res.json(response);
  }).catch((err) => {
        response = {"error" : true,"message" : "Error adding data"};
        console.log(err)
        res.json(response);
  });
};

const getStat = function (req,res) {
    UserStats.find({ idCuenta: req.params.id}, function (err, data) {
        if(err){
          response = {"error" : true,"message" : "Error al obtener datos"};
        }else{
          response = {"error" : false,"message" : data}
        }
        res.json(response);
    });
  };

  const getStats = function (req,res) {
    UserStats.find({}, function (err, data) {
        if(err){
          response = {"error" : true,"message" : "Error al obtener datos"};
        }else{
          response = {"error" : false,"message" : data}
        }
        res.json(response);
    });
  };

  const deleteStats = function (req,res) {
    UserStats.remove({}, function (err, data) {
        if(err){
          response = {"error" : true,"message" : "Error al obtener datos"};
        }else{
          response = {"error" : false,"message" : data}
        }
        res.json(response);
    });
  };

  const addTweet = function(req, res) {
      var response = {};
      UserStats.find({idCuenta: req.body.id}, function (err, data) {
        console.log("entro en addTweet")
          if(err){
            response = {"error" : true,"message" : "Error al obtener datos"};
            res.json(response);
          }else{
              var newUser = data[0]
              var tweet = {
                  account_name: req.body.account_name,
                  location: {
                      lat: req.body.location.lat,
                      long: req.body.location.long
                  },
                  time: req.body.fecha,
                  tweetLength: req.body.tweetLength
              }
              console.log(newUser)
              newUser.tweets.push(tweet)
              newUser.numTweets += 1
              console.log(newUser)
              UserStats.update({idCuenta: req.body.id},newUser, function (err, data) {
                  if(err){
                      response = {"error" : true,"message" : "Error updating Stat"};
                  }else{
                      response = {"error" : false,"message" : data};
                  }
                  res.json(response);
              });
          }
      });
  };

const usrAccess = function (req,res) {
    UserStats.update({idCuenta: req.body.id},{$inc: {numAccess: 1}},function (err,msg) {
      if(err) {
        response = {"error" : true,"message" : "Error updating Stat"};
        console.log(msg);
      } else {
        response = {"error" : false,"message" : "Stat has been updated!"};
        console.log(msg);
      }
      res.json(response);
    });
  };

  const usrBaja = function (req,res) {
    UserStats.update({idCuenta: req.body.id},{active: false, fechaBaja: req.body.fecha},function (err,msg) {
      if(err) {
        response = {"error" : true,"message" : "Error updating Stat"};
        console.log(msg);
      } else {
        response = {"error" : false,"message" : "Stat closed!"};
        console.log(msg);
      }
      res.json(response);
    });
  };

 module.exports = {
    postStat, addTweet, usrAccess, usrBaja, getStat, getStats, deleteStats
};