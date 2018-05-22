/**
 *
 * Direccion de la API de Mongo
 */
var bdPath= "http://localhost:3001";
if(process.env.EXEC === 'heroku') {
  bdPath = "https://frozen-atoll-44380.herokuapp.com";
}

module.exports = {bdPath};