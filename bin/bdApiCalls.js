const request = require('request');
var hpaths = require("./herokuSettings");
var bdPath = hpaths.bdPath;

function getUsuarios(query,callback) {
  request.get({
    baseUrl: bdPath,
    uri: "/users",
    qs: query,
    json:true
  },callback);

}

function postUsuarios(usuario){
  request.post({
    baseUrl: bdPath,
    uri: "/users",
    json: true,
    body: usuario
  });
}

function putUsuarios(usuario){
  request.put({
    baseUrl: bdPath,
    uri: "/users",
    json: true,
    body: usuario
  });
}

module.exports = {getUsuarios,postUsuarios,putUsuarios};