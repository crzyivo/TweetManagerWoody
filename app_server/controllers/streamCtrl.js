const bdPath = require('../bdApiCalls');
const twPath = require('../twitterCalls');
const credentials = require("../conf/twitterSettings");
const Twit = require('twit');
var hpaths = require("../conf/herokuSettings");
var urlPath = hpaths.urlPath;

const open = function (socket,msg) {
    var body_json = msg;
    bdPath.getAccount({email: body_json.usuario, account: body_json.cuenta },
        function (err, resBd, body) {
            if (err) {
                console.log(err);
                socket.close();
            }
            if (body.error) {
                socket.close();
            } else {
                var account = body.message;
                var T = new Twit({
                    consumer_key:credentials.twitterKeys.consumer_key,
                    consumer_secret:credentials.twitterKeys.consumer_secret,
                    access_token: account.token,
                    access_token_secret: account.tokenSecret
                });
                var stream = T.stream('statuses/filter',{
                    track: 'hey'
                });
                stream.on('tweet',function (tweet) {
                    socket.emit('tweet',{
                        text: tweet.text,
                        screen_name: tweet.user.screen_name,
                        name: tweet.user.name,
                        img: tweet.user.profile_image_url_https,
                        created: tweet.created_at,
                        retweet_count: tweet.retweet_count,
                        favorite_count: tweet.favorite_count});
                })
            }
        });
};

module.exports = {
    open:open
};