
var mongoose = require('mongoose');
const Usuario = require('../models/user');


const usrPost = function (req,res) {
  console.log(req.body);
  var newUser = new Usuario(
    {
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      email: req.body.email,
      origen: req.body.origen,
      password: "test",
      admin: false,
      primerAcceso: true,
      cuentas: []
    });
  if(req.body.cuentas !== undefined){
    newUser.cuentas.push({cuentaTwitter: req.body.cuentas})
  }
  var response = {};
  newUser.save()
  .then((newUser) => {
    response = {"error" : false,"message" : "User has been added!"};
    console.log(newUser);
    res.json(response);
  }).catch((err) => {
    response = {"error" : true,"message" : "Error adding data"};
    console.log(err)
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
    console.log(query);
    Usuario.find(query, function (err, data) {
        if(err){
          response = {"error" : true,"message" : err}; // "Error al obtener datos"
        }else{
          response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
};

const usrPut = function (req,res) {
  console.log(req.body.nombre);
  var newUser = req.body;
  var response = {};
  console.log(newUser);
  Usuario.update({email: newUser.email},newUser,function (err,msg) {
    if(err) {
      response = {"error" : true,"message" : "Error adding data"};
      console.log(msg);
    } else {
      response = {"error" : false,"message" : "User has been updated!"};
      console.log(msg);
    }
    res.json(response);
  });
};

const usrDelete = function (req,res) {
  console.log(req.body.nombre);
  var newUser = req.body;
  var response = {};
  console.log(newUser);
  Usuario.delete({email: newUser.email},function (err, msg) {
    if(err) {
      response = {"error" : true,"message" : "Error deleting data"};
      console.log(msg);
    } else {
      response = {"error" : false,"message" : "User has been deleted!"};
      console.log(msg);
    }
    res.json(response);
  });
};

 module.exports = {
    usrGet,usrPost,usrPut,usrDelete
};