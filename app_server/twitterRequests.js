//Modulo para construir peticiones http autenticadas a la API de Twitter

var twitterSettings= require('./conf/twitterSettings');
var cryptoJS = require('crypto-js');
var getRandomValues = require('get-random-values')

//From https://stackoverflow.com/questions/10051494/oauth-nonce-value
function genNonce() {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
  const result = [];
  getRandomValues(new Uint8Array(32)).forEach(c =>
      result.push(charset[c % charset.length]));
  return result.join('');
}
function generateSingature(http_method,url,parameters,oauth_consumer_key,oauth_nonce,oauth_signature_method,oauth_timestamp,oauth_token,oauth_token_secret,oauth_version) {
  var unencoded_parameters = {
    'oauth_consumer_key':oauth_consumer_key,
    'oauth_nonce':oauth_nonce,
    'oauth_signature_method':oauth_signature_method,
    'oauth_timestamp':oauth_timestamp,
    'oauth_token':oauth_token,
    'oauth_version':oauth_version
  };
  if(parameters.length!==0) {
      Object.keys(parameters).forEach(function (key) {
          unencoded_parameters[key] = parameters[key];
      });
  }
  var encoded_parameters={};
  Object.keys(unencoded_parameters).forEach(function (key) {
    var encoded_key= encodeURIComponent(key);
    var encoded_value = encodeURIComponent(unencoded_parameters[key]);
    encoded_parameters[encoded_key]=encoded_value;
  });
  var unordered = Object.keys(encoded_parameters);
  unordered.sort();
  var ordered= [];
  unordered.forEach(function (key){
    ordered[key]=encoded_parameters[key];
  });
  var parameter_string='';
  var i = 0;
  Object.keys(ordered).forEach(function (key) {
      parameter_string += i===0 ? key+'='+ordered[key] : '&'+key+'='+ordered[key];
      i++;
  });
  var uppercase_method = http_method.toUpperCase();
  var encoded_url = encodeURIComponent(url);
  var signature_base = uppercase_method+'&'+encoded_url+'&'+parameter_string;
  var signing_key = encodeURIComponent(twitterSettings.twitterKeys.consumer_secret)+'&'+encodeURIComponent(oauth_token_secret);
  var hash = cryptoJS.HmacSHA1(signature_base,signing_key);
  return cryptoJS.enc.Base64.stringify(hash);
  //TODO: https://developer.twitter.com/en/docs/basics/authentication/guides/creating-a-signature.html
}
var twitterHeader = function (http_method,url,parameters,user_token,user_token_secret) {
  var oauth_consumer_key = twitterSettings.twitterKeys.consumer_key;
  var oauth_nonce = genNonce();
  var oauth_signature_method= 'HMAC-SHA1';
  var oauth_timestamp = Math.floor((new Date).getTime()/1000);
  var oauth_token = user_token;
  var oauth_version  = '1.0';
  var oauth_signature = generateSingature(http_method,url,parameters,oauth_consumer_key,oauth_nonce,oauth_signature_method,oauth_timestamp,oauth_token,user_token_secret,oauth_version);
  var auth_header = 'OAuth '+
      encodeURIComponent('oauth_consumer_key')+'='+'"'+encodeURIComponent(oauth_consumer_key)+'", '+
      encodeURIComponent('oauth_nonce')+'='+'"'+encodeURIComponent(oauth_nonce)+'", '+
      encodeURIComponent('oauth_signature_method')+'='+'"'+encodeURIComponent(oauth_signature_method)+'", '+
      encodeURIComponent('oauth_timestamp')+'='+'"'+encodeURIComponent(oauth_timestamp)+'", '+
      encodeURIComponent('oauth_token')+'='+'"'+encodeURIComponent(oauth_token)+'", '+
      encodeURIComponent('oauth_signature')+'='+'"'+encodeURIComponent(oauth_signature)+'", '+
      encodeURIComponent('oauth_version')+'='+'"'+encodeURIComponent(oauth_version)+'"';
  return auth_header;
};

module.exports = {
  twitterHeader: twitterHeader
};

