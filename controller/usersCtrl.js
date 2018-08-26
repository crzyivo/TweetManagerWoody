
var mongoose = require('mongoose');
const Usuario = require('../models/user');


const usrPost = function (req,res) {
  console.log("imprimo nuevo user")
  // console.log(req.body);
  var newUser = new Usuario(req.body);
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
    console.log(req.query)
    if(req.query.email){
      query.email = req.query.email;
    }
    if(req.query.origen){
      query.origen  = req.query.origen;
    }
    console.log(query);
    Usuario.find(query, function (err, data) {
        if(err){
          response = {"error" : true,"message" : "Error al obtener datos"};
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
  // console.log(req.query)  // Para hacer con postman
  // console.log(req.body)
  Usuario.findOneAndRemove({email: req.body.email})
  .then(() => {
      response = {"error" : false,"message" : "User has been deleted!"};
      res.json(response);
  }).catch((err)=>{
      response = {"error" : true,"message" : "Error deleting data"};
      console.log(err)
      res.json(response);
  })
};

const accDelete = function (req,res) {
  // console.log(req.query)  // Para hacer con postman
  // console.log(req.body)
  Usuario.find({email: req.body.email})
  .then((user) => {
      var index = user[0].cuentas.map((acc) => { return acc.cuentaTwitter}).indexOf(req.body.account)
      console.log(index)
      if (index !== -1) {
        user[0].cuentas.splice(index, 1)
      }
      console.log(user[0].cuentas)
      Usuario.update({email: req.body.email},user[0],function (err,msg) {
        if(err) {
          response = {"error" : true,"message" : "Error updating data"};
        } else {
          response = {"error" : false,"message" : user};
        }
        res.json(response);
      })
  }).catch((err)=>{
      response = {"error" : true,"message" : "Error deleting account"};
      console.log(err)
      res.json(response);
  })
};

const accGet = function (req,res) {
  // console.log(req.query)  // Para hacer con postman
  // console.log(req.body)
  console.log(req.query)
  Usuario.find({email: req.query.email})
  .then((user) => {
    console.log(user);
      var index = user[0].cuentas.map((acc) => { return acc.cuentaTwitter}).indexOf(req.query.account)
      console.log(index)
      if (index === -1) {
        console.log('dafuck')
        response = {"error" : true,"message" : "Account doesn't exist"};
      }
      else{
        console.log(user[0].cuentas);
        response = {"error" : false,"message" : user[0].cuentas[index]};
      }
      res.json(response);
  }).catch((err)=>{
    console.log('dafuck')
      response = {"error" : true,"message" : "Error deleting account"};
      console.log(err)
      res.json(response);
  })
};

const accPost = function (req,res) {
  // console.log(req.query)  // Para hacer con postman
  // console.log(req.body)
  Usuario.find({email: req.body.email})
  .then((user) => {
      var index = user[0].cuentas.map((acc) => { return acc}).indexOf(req.body.account)
      console.log(index)
      if (index === -1) {
        user[0].cuentas.push(req.body.account)
      }
      console.log(user[0].cuentas)
      Usuario.update({email: req.body.email},user[0],function (err,msg) {
        if(err) {
          response = {"error" : true,"message" : "Error updating data"};
        } else {
          response = {"error" : false,"message" : user};
        }
        res.json(response);
      })
  }).catch((err)=>{
      response = {"error" : true,"message" : "Error adding account"};
      console.log(err)
      res.json(response);
  })
};

 module.exports = {
    usrGet,usrPost,usrPut,usrDelete, accDelete, accPost, accGet
};