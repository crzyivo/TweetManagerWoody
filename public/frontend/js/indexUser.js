//frontend/js/indexUser.js

var indexUser = angular.module('indexUs',['LocalStorageModule']);

indexUser.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
      .setPrefix('loginNg')
      .setStorageType('sessionStorage')
});

indexUser.controller('index',['$scope','$http','$window','localStorageService',function($scope, $http, $window, localStorageService) {

  $http.get('/acc', {
    params: {
      email: localStorageService.get('username')
    }
  }).then(function(response){
    $scope.cuentas = response.data
  })

  $scope.deleteAcc = function(account){
    console.log("entro aqui")
    console.log(account)
    $http.put('/acc/deleteAcc', {
      params: {
        email: localStorageService.get('username'),
        acc: account
      }
    }).then(function(response){
      $scope.cuentas = response.cuentas
    })
  };
  
}]);