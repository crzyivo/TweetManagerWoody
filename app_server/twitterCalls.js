const request = require('request');
const credentials = require("./conf/twitterSettings");
const twitterBase = 'https://api.twitter.com/1.1';
const twitterHeader = require('./twitterRequests');

//require('request-debug')(request);
function getAcc(query,callback) {
  request.get({
    baseUrl: bdPath,
    uri: "/users",
    qs: query,
    json:true
  },callback);

}

function getHome(count,user_token,user_secret,callback){
  var endpoint = '/statuses/home_timeline.json';
  var count_parameter = {
    count:count
  };
  var header = twitterHeader.twitterHeader('GET',twitterBase+endpoint,[],user_token,user_secret);
  var oauth = {
    consumer_key: credentials.twitterKeys.consumer_key,
    consumer_secret: credentials.twitterKeys.consumer_secret,
    token: user_token,
    token_secret: user_secret
  };
  request.get({
      url: twitterBase+endpoint,
      oauth: oauth,
      qs:{count:count},
      json:true
  },callback);

}

function getUserTweets(user,count,user_token,user_secret,callback){
    var endpoint = '/statuses/user_timeline.json';
    var oauth = {
        consumer_key: credentials.twitterKeys.consumer_key,
        consumer_secret: credentials.twitterKeys.consumer_secret,
        token: user_token,
        token_secret: user_secret
    };
    request.get({
        url: twitterBase+endpoint,
        oauth: oauth,
        qs:{
          count:count,
          screen_name:user
        },
        json:true
    },callback);
}

function getUserMentions(count,user_token,user_secret,callback){
    var endpoint = '/statuses/mentions_timeline.json';
    var oauth = {
        consumer_key: credentials.twitterKeys.consumer_key,
        consumer_secret: credentials.twitterKeys.consumer_secret,
        token: user_token,
        token_secret: user_secret
    };
    request.get({
        url: twitterBase+endpoint,
        oauth: oauth,
        qs:{
            count:count
        },
        json:true
    },callback);
}
function postTweet(text,user_token,user_secret,callback){
    var endpoint = '/statuses/update.json';
    var oauth = {
        consumer_key: credentials.twitterKeys.consumer_key,
        consumer_secret: credentials.twitterKeys.consumer_secret,
        token: user_token,
        token_secret: user_secret
    };
    request.post({
        url: twitterBase+endpoint,
        oauth: oauth,
        qs:{
            status:text
        },
        json:true
    },callback);
}

function getReTweets(count,user_token,user_secret,callback){
  var endpoint = '/statuses/retweets_of_me.json';
  var oauth = {
    consumer_key: credentials.twitterKeys.consumer_key,
    consumer_secret: credentials.twitterKeys.consumer_secret,
    token: user_token,
    token_secret: user_secret
  };
  request.get({
    url: twitterBase+endpoint,
    oauth: oauth,
    qs:{
      count:count
    },
    json:true
  },callback);
}

function stream(keys,user_token,user_secret,callback){
    var url = 'https://stream.twitter.com/1.1/statuses/filter.json';
    var oauth = {
        consumer_key: credentials.twitterKeys.consumer_key,
        consumer_secret: credentials.twitterKeys.consumer_secret,
        token: user_token,
        token_secret: user_secret
    };
    request.post({
        url: url,
        oauth: oauth,
        qs:{
            track:keys
        }
    }).on('data',callback);
}




module.exports = {
    getAcc,
    getHome,
    getUserTweets,
    getUserMentions,
    postTweet,
    getReTweets,
    stream
};