//Modulo para construir peticiones http autenticadas a la API de Twitter

var twitterSettings= require('./conf/twitterSettings');

//From https://stackoverflow.com/questions/10051494/oauth-nonce-value
function genNonce() {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~'
  const result = [];
  window.crypto.getRandomValues(new Uint8Array(32)).forEach(c =>
      result.push(charset[c % charset.length]));
  return result.join('');
}
function generateSingature(http_method,url,parameters,oauth_consumer_key,oauth_nonce,oauth_signature_method,oauth_timestamp,oauth_token,oauth_version) {
  var unencoded_parameters = {
    'oauth_consumer_key':oauth_consumer_key,
    'oauth_nonce':oauth_nonce,
    'oauth_signature_method':oauth_signature_method,
    'oauth_timestamp':oauth_timestamp,
    'oauth_token':oauth_token,
    'oauth_version':oauth_version
  };
  Object.keys(parameters).forEach(function (key) {
    unencoded_parameters[key]=parameters[key];
  });
  var encoded_parameters;
  Object.keys(unencoded_parameters).forEach(function (key) {
    var encoded_key= encodeURIComponent(key);
    var encoded_value = encodeURIComponent(unencoded_parameters[key]);
    encoded_parameters[encoded_key]=encoded_value;
  })
  var unordered = Object.keys(encoded_parameters);
  unordered.sort();
  var ordered;
  unordered.forEach(key){
    ordered[key]=encoded_parameters[key];
  }
  //TODO: https://developer.twitter.com/en/docs/basics/authentication/guides/creating-a-signature.html
}
var twitterHeader = function (http_method,url,parameters,user_token) {
  var oauth_consumer_key = twitterSettings.twitterKeys.consumer_key;
  var oauth_nonce = genNonce();
  var oauth_signature_method= 'HMAC-SHA1';
  var oauth_timestamp = new Date().getTime();
  var oauth_token = user_token;
  var oauth_version  = '1.0';
  var oauth_signature = geterateSignature(http_method,url,parameters,oauth_consumer_key,oauth_nonce,oauth_signature_method,oauth_timestamp,oauth_token,oauth_version);

}