//frontend/js/accNg.js

var accNg = angular.module('account',['LocalStorageModule','navs']);

accNg.config(function (localStorageServiceProvider,$locationProvider) {
  localStorageServiceProvider
      .setPrefix('loginNg')
      .setStorageType('sessionStorage')
  $locationProvider.html5Mode(true);
});

accNg.controller('info',['$scope','$http','$window','localStorageService','$location', function($scope, $http,
    $window, localStorageService,$location) {
  var params = $location.search();
  console.log($location.search());
    $scope.thisCuenta = params.acc;
    $scope.error = ""

  $http.get('/acc/twits/'+$scope.thisCuenta+'/'+localStorageService.get('username')
  ).then(function(response){
    $scope.cuentaInfo = response.data
  })

  $scope.openAcc = function(account){
    localStorageService.set('account', account);
    $window.location.href = '/frontend/pages/cuenta';
  };
  
}]);