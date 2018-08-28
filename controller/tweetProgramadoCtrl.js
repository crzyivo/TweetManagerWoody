var mongoose = require('mongoose');
const TweetProgramado = require('../models/tweetProgramado');

/**
 * Añade un nuevo tweet programado
 * @param req
 * @param res
 */
const tweetPost = function (req,res) {
    var newTweet = new TweetProgramado(req.body);
    var date = new Date(req.body.trigger);
    newTweet.trigger= date;
    newTweet.creado = new Date();
    newTweet.status = 'pendiente';
    newTweet.save()
        .then((newTweet) => {
            response = {"error" : false,"message" : "Tweet has been added!"};
            res.json(response);
        }).catch((err) => {
        response = {"error" : true,"message" : "Error adding data"};
        console.log(err);
        res.json(response);
    });

};

/**
 * Obtiene todos los tweets programados de un usuario y una cuenta
 * @param req
 * @param res
 */
const tweetGet = function(req,res){
    var response = {};
    var query = {usuario:req.query.email, cuenta:req.query.cuenta};
    TweetProgramado.find(query,function (err,data) {
        if(err){
            response = {"error" : true,"message" : "Error al obtener datos"};
        }else{
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
};
module.exports = {
    tweetPost,
    tweetGet
};