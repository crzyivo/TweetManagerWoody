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

indexAdmin.controller('index',['$scope','$http','$window','localStorageService','$rootScope','$location',function($scope, $http, $window, localStorageService,$rootScope,$location) {

  $scope.nameAcc = " ";
  $scope.error = "";
  $scope.cuentas = {};
  $http.get('/users/users').then(function(response){
    var indexAux = response.data.map((user)=>{return user.admin}).indexOf(true)
    $scope.cuentas = response.data
    if(indexAux > -1){
      $scope.cuentas.splice(indexAux,1)
    }
    $scope.cuentas = $scope.cuentas.map((user) => {
      console.log(user)
      return {
          nombre: user.nombre,
          apellidos: user.apellidos,
          email: user.email,
          entradaApp: new Date(user.entradaApp).toLocaleString(),
          ultimoAcceso: new Date(user.ultimoAcceso).toLocaleString()
        }
    })
    localStorageService.set('cuentas', $scope.cuentas);
    $rootScope.$broadcast('LocalStorageModule.notification.setItem',{key: 'loginNg.cuentas', newvalue: $scope.cuentas})
  });

  $scope.openAcc = function(account){
    var aux = $scope.cuentas.map((acc)=> {return acc.email}).indexOf(account);
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
    $http.get('/users/deleteUser', {
      params: {
        email: account
      }
    }).then(function(response){
      console.log(response)
      var indexAux = response.data.map((user)=>{return user.admin}).indexOf(true)
      $scope.cuentas = response.data
      if(indexAux > -1){
        $scope.cuentas.splice(indexAux,1)
      }
      $scope.cuentas = $scope.cuentas.map((user) => {
        return {
            nombre: user.nombre,
            apellidos: user.apellidos,
            email: user.email,
            entradaApp: new Date(user.entradaApp).toLocaleString(),
          ultimoAcceso: new Date(user.ultimoAcceso).toLocaleString()
        }
      })
      localStorageService.set('cuentas', $scope.cuentas);
      $rootScope.$broadcast('LocalStorageModule.notification.setItem',{key: 'loginNg.cuentas', newvalue: $scope.cuentas});
    })
  };
}]);