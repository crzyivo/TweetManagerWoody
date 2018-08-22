const request = require('request');
var hpaths = require("./conf/herokuSettings");
var bdPath = hpaths.bdPath;

function getUsuarios(query,callback) {
  request.get({
    baseUrl: bdPath,
    uri: "/users",
    qs: query,
    json:true
  },callback);

}

function postUsuarios(usuario,callback){
  request.post({
    baseUrl: bdPath,
    uri: "/users",
    json: true,
    body: usuario
  },callback);
}

function recoverPassword(usuario,callback){
  request.post({
    baseUrl: bdPath,
    uri: "/users/recover",
    json: true,
    body: usuario
  },callback);
}

function putUsuarios(usuario,callback){
  request.put({
    baseUrl: bdPath,
    uri: "/users",
    json: true,
    body: usuario
  },callback);
}

function deleteUsuarios(usuario,callback){
  request.delete({
    baseUrl: bdPath,
    uri: "/users",
    json: true,
    body: usuario
  },callback);
}

function deleteAccount(cuenta,callback){
  request.put({
    baseUrl: bdPath,
    uri: "/users/acc",
    json: true,
    body: cuenta
  },callback);
}

module.exports = {getUsuarios,postUsuarios,putUsuarios, deleteUsuarios, recoverPassword, deleteAccount};