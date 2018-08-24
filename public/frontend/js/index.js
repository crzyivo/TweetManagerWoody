//public/frontend/js/index.js

var indexNg = angular.module('index',['LocalStorageModule','navs']);

indexNg.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('loginNg')
        .setStorageType('sessionStorage')
        .setNotify(true, true);
});

indexNg.controller('setSession',['$scope','$http','$window','localStorageService',function($scope,$http,$window,localStorageService) {
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
indexNg.controller('index',['$scope','$http','$window','localStorageService','$rootScope',function($scope, $http, $window, localStorageService,$rootScope) {
  $scope.nameAcc = " ";
  $scope.error = "";
  $scope.cuentas = {};
  $http.get('/acc', {
    params: {
      email: localStorageService.get('username')
    }
  }).then(function(response){
    console.log(response.data);
    $scope.cuentas = response.data;
    localStorageService.set('cuentas', response.data);
  });

  $scope.openAcc = function(account){
    var aux = $scope.cuentas.map((acc)=> {return acc.cuentaTwitter}).indexOf(account);
    if(aux !== -1){
      localStorageService.set('account', account);
      console.log(aux);
      $window.location.href = '/frontend/pages/cuenta';
      // redirige siempre aquí aunque borres la cuenta porque no se actualiza
    }
    else{
      $window.location.href = '/frontend/pages/indexUser';
    }

  };

  $scope.deleteAcc = function(account){
    $http.put('/acc/deleteAcc', {
      params: {
        email: localStorageService.get('username'),
        acc: account
      }
    }).then(function(response){
      $scope.cuentas = response.data;
      localStorageService.set('cuentas', response.data);
      $rootScope.$broadcast('LocalStorageModule.notification.setItem',{key: 'loginNg.cuentas', newvalue: response.data});
      $scope.error = ""
    })
  };

  $scope.TWAcc = function(){
    if($scope.nameAcc.replace(/\s/g, '') !== '') {
      $http.get('/acc/show').then(()=>{
        $http.put('/acc/insertAcc', {
          params: {
            email: localStorageService.get('username'),
            acc: $scope.nameAcc
          }
        }).then(function(response){
          $scope.cuentas = response.data;
          localStorageService.set('cuentas', response.data);
          $scope.error = "";
          $window.location.href = '/frontend/pages/indexUser';
        })
      })
    }
    else {
      $scope.error = "Inserte un usuario para insertar nueva cuenta"
    }
  };

  $scope.updateAcc = function(){
    if($scope.nameAcc.replace(/\s/g, '') !== '') {
      $http.put('/acc/insertAcc', {
        params: {
          email: localStorageService.get('username'),
          acc: $scope.nameAcc
        }
      }).then(function(response){
        $scope.cuentas = response.data;
        localStorageService.set('cuentas', response.data);
        $scope.error = "";
        $window.location.href = '/frontend/pages/indexUser';
      })
    }
    else {
      $scope.error = "Inserte un usuario para insertar nueva cuenta"
    }
  };
}]);