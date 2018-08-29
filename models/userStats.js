var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userStats = new Schema({
    idCuenta: String,
    email: String,
    active: {type: Boolean, default: true},
    numTweets: Number,
    tweets: [{
        account_name: String,
        location: {
            lat: String,
            long: String
        },
        time: Date,
        tweetLength: Number
    }],
    fechaBaja: Date,
    fechaAlta: Date,
    numAccess: Number
});

module.exports = mongoose.model('Stats', userStats);