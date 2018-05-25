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

function putUsuarios(usuario,callback){
  request.put({
    baseUrl: bdPath,
    uri: "/users",
    json: true,
    body: usuario
  },callback);
}

module.exports = {getUsuarios,postUsuarios,putUsuarios};