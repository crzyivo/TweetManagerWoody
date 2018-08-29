const request = require('request');
var hpaths = require("./conf/herokuSettings");
var bdPath = hpaths.bdPath;

function getUserStats(query,email,callback) {
    request.get({
        baseUrl: bdPath,
        uri: "/stat/getStat/" + email,
        qs: query,
        json:true
    },callback);
}

function updateAccess(stats,callback) {
    request.put({
        baseUrl: bdPath,
        uri: "/stat/usrAccess",
        json: true,
        body: stats
        },callback);
}

function updateBaja(stats,callback) {
    request.put({
        baseUrl: bdPath,
        uri: "/stat/usrBaja",
        json: true,
        body: stats
        },callback);
}

function addTwitStats(tweet,callback) {
    request.put({
        baseUrl: bdPath,
        uri: "/stat/addTweet",
        json: true,
        body: tweet
        },callback);
}

function createStat(stat,callback) {
    request.post({
        baseUrl: bdPath,
        uri: "/stat/addStat",
        json: true,
        body: stat
        },callback);
}

function usersStats(query,callback) {
    request.get({
        baseUrl: bdPath,
        uri: "/stat/getStats",
        query: query,
        json: true,
        },callback);
}

module.exports = {getUserStats, createStat ,updateAccess,updateBaja, addTwitStats, usersStats};