//frontend/js/accNg.js

var accNg = angular.module('account',['LocalStorageModule']);

accNg.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
      .setPrefix('loginNg')
      .setStorageType('sessionStorage')
});

accNg.controller('info',['$scope','$http','$window','localStorageService', function($scope, $http, 
    $window, localStorageService) {

    $scope.otrasCuentas = localStorageService.get('cuentas')
    $scope.thisCuenta = localStorageService.get('account')
    $scope.error = ""

  $http.get('/acc/'+localStorageService.get('account')+'/'+localStorageService.get('username')
  ).then(function(response){
    $scope.cuentaInfo = response.data
  })

  $scope.openAcc = function(account){
    localStorageService.set('account', account);
    $window.location.href = '/frontend/pages/cuenta';
  };
  
}]);