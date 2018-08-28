/**
 * Variables que dependen del entorno de ejecución, ya sea en Heroku o en local.
 * Para distinguirlas se declara en Heroku una variable de entorno llamada EXEC.
 */

//Entorno de ejecución
var entorno = "local";

//Dirección del API de la base de datos Mongo
var bdPath= "http://localhost:3001";

//Url absoluto de la aplicación
var urlPath = "https://localhost:3003";

if(process.env.EXEC === 'heroku'){
  entorno = 'heroku';
  bdPath = "https://frozen-atoll-44380.herokuapp.com";
  urlPath = "https://mighty-depths-30160.herokuapp.com";
}

module.exports = {bdPath,urlPath,entorno};