
var mongoose = require('mongoose');
const Usuario = require('../models/user');


const usrPost = function (req,res) {
  console.log(req.body.nombre);
  var newUser = new Usuario();
    newUser.nombre= req.body.nombre;
    newUser.apellidos =  req.body.apellidos;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.origen = req.body.origen;
  var response = {};
  newUser.save(function (err,newUser) {
    if(err) {
      response = {"error" : true,"message" : "Error adding data"};
      newUser.log();
    } else {
      response = {"error" : false,"message" : "User has been added!"};
      newUser.log();
    }
    res.json(response);
  });
};
const usrGet = function(req, res) {
    var response = {};
    var query = {};
    if(req.query.email){
      query.email = req.query.email;
    }
    if(req.query.origen){
      query.origen  = req.query.origen;
    }
    if(req.query.id){}
    Usuario.find(query,function (err, data) {
        if(err){
          response = {"error" : true,"message" : "Error al obtener datos"};
        }else{
          response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
};

 module.exports = {
    usrGet,usrPost
};