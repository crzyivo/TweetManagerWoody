//frontend/js/accNg.js

var accNg = angular.module('account',['LocalStorageModule','navs','tweet']);

accNg.config(function (localStorageServiceProvider,$locationProvider) {
  localStorageServiceProvider
      .setPrefix('loginNg')
      .setStorageType('sessionStorage')
  $locationProvider.html5Mode(true);
});

accNg.controller('info',['$scope','$http','$window','localStorageService','$location', function($scope, $http,
    $window, localStorageService,$location) {
  var params = $location.search();
    $scope.thisCuenta = params.acc;
    $scope.error = ""
    $scope.url = ""
    $scope.tweet_text = ""
    $scope.showM = false

  $http.get('/acc/twits/home/'+$scope.thisCuenta+'/'+localStorageService.get('username')
    ).then(function(response){
      $scope.home = response.data;
    });
  $http.get('/acc/twits/user/'+$scope.thisCuenta+'/'+localStorageService.get('username')
    ).then(function(response){
        $scope.user_timeline = response.data;
    });
  $http.get('/acc/twits/mentions/'+$scope.thisCuenta+'/'+localStorageService.get('username')
    ).then(function(response){
       $scope.user_mentions = response.data;
    });

  $scope.postTweet = function(){
    $http.post('/acc/twits/newTweet/'+$scope.thisCuenta+'/'+localStorageService.get('username'),
        {text:$scope.tweet_text}
    ).then(function (response) {
        $http.get('/acc/twits/user/'+$scope.thisCuenta+'/'+localStorageService.get('username')
        ).then(function(response){
            $scope.user_timeline = response.data;
        });
    })
  };
  $scope.openAcc = function(account){
    localStorageService.set('account', account);
    $window.location.href = '/frontend/pages/cuenta';
  };

  $scope.urlShortcut = function(url){
    $http.post('http://localhost:3001/url/item', { "originalUrl": url, "shortBaseUrl": "https://localhost:3001" })
      .then(function (response){
          if(response.error === undefined){
            console.log(response)
            $scope.url = "http://localhost:3001/url/item/"+response.data.urlCode
            $scope.tweet_text = $scope.tweet_text + ' ' + $scope.url
            $scope.showM = true
          }
      })
  }
  
}]);