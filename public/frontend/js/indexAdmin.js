//frontend/js/indexAdmin.js

var indexAdmin = angular.module('indexAd',['LocalStorageModule','navs']);

indexAdmin.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
      .setPrefix('loginNg')
      .setStorageType('sessionStorage')
      .setNotify(true, true);
});

indexAdmin.controller('setSession',['$scope','$http','$window','localStorageService',function($scope,$http,$window,localStorageService) {
    if(localStorageService.get("username") ==="" || localStorageService.get("username") === null) {
      $http.get('/session', {})
          .success(function (data) {
            localStorageService.set('username', data.user);
            console.log(data);
          })
          .error(function (data) {
            $scope.error = "Login incorrecto";
            console.log(data);
          });
    }
  }]);

indexAdmin.controller('index',['$scope','$http','$window','localStorageService',function($scope, $http, $window, localStorageService) {

  $scope.nameAcc = " ";
  $scope.error = "";
  $scope.users = {};
  $http.get('/users/users').then(function(response){
    $scope.users = response.data;
    localStorageService.set('cuentas', response.data);
  });

  $scope.openAcc = function(account){
    var aux = $scope.users.map((acc)=> {return acc.email}).indexOf(account);
    if(aux !== -1){
      localStorageService.set('account', account);
      console.log(aux);
      $window.location.href = '/frontend/pages/settingsAdmin';  
      // redirige siempre aquí aunque borres la cuenta porque no se actualiza
    }
    else{
      $window.location.href = '/frontend/pages/indexAdmin';
    }
    
  };

  $scope.deleteAcc = function(account){
    $http.get('/deleteUser', {
      params: {
        email: account
      }
    }).then(function(response){
      $scope.cuentas = response.data;
      localStorageService.set('cuentas', response.data);
      $scope.error = ""
    })
  };
}]);