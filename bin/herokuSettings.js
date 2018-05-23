/**
 *
 * Direccion de la API de Mongo
 */
var bdPath= "http://localhost:3001";
if(process.env.EXEC === 'heroku') {
  bdPath = "https://frozen-atoll-44380.herokuapp.com";
}

var urlPath = "http://localhost:3000";
if(process.env.EXEC === 'heroku') {
  urlPath = "https://mighty-depths-30160.herokuapp.com";
}


module.exports = {bdPath,urlPath};