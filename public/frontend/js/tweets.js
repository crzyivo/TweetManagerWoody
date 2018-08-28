//public/frontend/js/tweets.js
var tweetNg = angular.module('tweet',[]);

tweetNg.directive('oneTweet',function () {
    var controller = ['$scope','$window',function($scope,$window) {
        var time = moment($scope.tweetObj.created);
        $scope.time = time.fromNow();
    }];
    return {
        controller: controller,
        restrict: 'E',
        templateUrl: '../pages/tweets.html',
        scope:{
            tweetObj: '=tweet'
        }
    }
});

tweetNg.directive('oneTweetProg',function () {
    var controller = ['$scope','$window',function($scope,$window) {
        var time = moment($scope.tweetObj.created);
        $scope.time = time.fromNow();
    }];
    return {
        controller: controller,
        restrict: 'E',
        templateUrl: '../pages/tweetsProg.html',
        scope:{
            tweetObj: '=tweet'
        }
    }
});
