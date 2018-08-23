const request = require('request');
var hpaths = require("./conf/herokuSettings");
var credentials = require("./conf/twitterSettings");
var bdPath = hpaths.bdPath;

function getAcc(query,callback) {
  request.get({
    baseUrl: bdPath,
    uri: "/users",
    qs: query,
    json:true
  },callback);

}


module.exports = {getAcc};