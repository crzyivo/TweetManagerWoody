//frontend/js/accNg.js
var accNg = angular.module('account', ['LocalStorageModule', 'navs', 'tweet', '720kb.datepicker','btford.socket-io']);
function listener(tweet,tw_array) {
    //console.log("Received data from websocket: ", messageObj);
    //console.log(data);
    var tweet_obj = {
        text: tweet.text,
        screen_name: tweet.user.screen_name,
        name: tweet.user.name,
        img: tweet.user.profile_image_url_https,
        created: tweet.created_at,
        retweet_count: tweet.retweet_count,
        favorite_count: tweet.favorite_count
    };
    tw_array.push(tweet_obj);
}

accNg.config(function (localStorageServiceProvider, $locationProvider) {
    localStorageServiceProvider
        .setPrefix('loginNg')
        .setStorageType('sessionStorage')
    $locationProvider.html5Mode(true);
});
accNg.factory('socket', function(socketFactory) {
    return socketFactory({
        ioSocket: io.connect('https://localhost:3003')
    });
});
accNg.controller('info', ['$scope', '$http', '$window', 'localStorageService', '$location','socket',
    function ($scope, $http, $window, localStorageService, $location,socket) {
    var params = $location.search();
    $scope.thisCuenta = params.acc;
    $scope.error = "";
    $scope.url = "";
    $scope.tweet_text = "";
    $scope.tweet_text_prog = "";
    $scope.tweet_stream=[];
    var today = moment().subtract(1, 'days');
    $scope.today = today.toDate().toString();
    $http.get('/acc/twits/home/' + $scope.thisCuenta + '/' + localStorageService.get('username')
    ).then(function (response) {
        $scope.home = response.data;
    });
    $http.get('/acc/twits/user/' + $scope.thisCuenta + '/' + localStorageService.get('username')
    ).then(function (response) {
        $scope.user_timeline = response.data;
    });
    $http.get('/acc/twits/mentions/' + $scope.thisCuenta + '/' + localStorageService.get('username')
    ).then(function (response) {
        $scope.user_mentions = response.data;
        console.log($scope.user_mentions);
    });
    $http.get('/acc/twits/retweets/' + $scope.thisCuenta + '/' + localStorageService.get('username')
    ).then(function (response) {
        $scope.user_retweets = response.data;
    });
    $http.get('/acc/twits/hashtags/' + $scope.thisCuenta + '/' + localStorageService.get('username')
    ).then(function (response) {
        $scope.hashtags = response.data;
        //Abrimos stream con los hashtags
        socket.emit('start',{keys:$scope.hashtags,cuenta:$scope.thisCuenta,usuario:localStorageService.get('username')});
        socket.on('tweet',function (tweet) {
            $scope.tweet_stream.unshift(tweet);
        })
    });
    $http.get('/acc/twits/favs/' + $scope.thisCuenta + '/' + localStorageService.get('username')
    ).then(function (response) {
        $scope.user_favs = response.data;
    });
    $http.get('/acc/twits/programados/' + $scope.thisCuenta + '/' + localStorageService.get('username')
    ).then(function (response) {
        $scope.programmed = response.data;
    });

    $scope.postTweet = function () {
        $http.post('/acc/twits/newTweet/' + $scope.thisCuenta + '/' + localStorageService.get('username'),
            {text: $scope.tweet_text}
        ).then(function (response) {
            $http.get('/acc/twits/user/' + $scope.thisCuenta + '/' + localStorageService.get('username')
            ).then(function (response) {
                $scope.user_timeline = response.data;
            });
        })
    };

    $scope.addHashtag = function () {
        // var array_keys = $scope.new_hashtags.split(',');
        // $http.post('/acc/twits/hashtags/' + $scope.thisCuenta + '/' + localStorageService.get('username'),
        //     {hashtags: array_keys}
        // ).then(function (response) {
        //     $scope.hashtags = response.data;
        // })
        socket.send('holalsdñ');
    };

    $scope.deleteHashtag = function (key) {
        $http.delete('/acc/twits/hashtags/'+ key +'/' + $scope.thisCuenta + '/' + localStorageService.get('username')
        ).then(function (response) {
            $scope.hashtags = response.data;
        })
    };

    $scope.postTweetProg = function () {
        $scope.error = false;
        var actual_date = moment($scope.tweet_date, "DD/MM/YYYY HH:mm:ss");
        var liveDate;
        try {
            liveDate = new Date(actual_date);
            console.log(liveDate);
            console.log(moment($scope.tweet_date, "DD/MM/yyyy HH:mm:ss").toDate())
        } catch (e) {
        }
        if (!liveDate || liveDate < new Date()) {
            console.log('invalid');
            $scope.error = true;
            $scope.error_msg = "La fecha introducida no es correcta";
        } else {
            $scope.error = false;
            var found = localStorageService.get('cuentas').find(function (element) {
                return element.account_name === $scope.thisCuenta;
            });

            $http.post('/acc/twits/programados/' + $scope.thisCuenta + '/' + localStorageService.get('username'),
                {
                    text: $scope.tweet_text_prog,
                    public_name: found.public_name,
                    trigger: actual_date

                }
            ).then(function (response) {
                $http.get('/acc/twits/programados/' + $scope.thisCuenta + '/' + localStorageService.get('username')
                ).then(function (resProg) {
                    $scope.programmed = resProg.data;
                });
            })
        }
    };
    $scope.openAcc = function (account) {
        localStorageService.set('account', account);
        $window.location.href = '/frontend/pages/cuenta';
    };

    $scope.urlShortcut = function (url, type) {
        // en vez de localhost->> https://mighty-depths-30160.herokuapp.com
        $http.post('/acc/addUrl', {"originalUrl": url})
            .then(function (response) {
                if (response.error === undefined) {
                    if (type === 'normal') {
                        $scope.url = response.data.shortUrl
                        $scope.tweet_text = $scope.tweet_text + ' ' + $scope.url
                        $scope.tweet_url = ""
                    }
                    else if (type === 'prog') {
                        $scope.url = response.data.shortUrl
                        $scope.tweet_text_prog = $scope.tweet_text_prog + ' ' + $scope.url
                        $scope.tweet_url_prog = ""
                    }
                }
            })
    }

}]);