//frontend/js/indexUser.js

var indexUser = angular.module('indexUs',['LocalStorageModule']);

indexUser.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
      .setPrefix('loginNg')
      .setStorageType('sessionStorage')
      .setNotify(true, true);
});

indexUser.controller('index',['$scope','$http','$window','localStorageService',function($scope, $http, $window, localStorageService) {

  $scope.nameAcc = " ";
  $scope.error = "";
  $scope.cuentas = {};
  $http.get('/acc', {
    params: {
      email: localStorageService.get('username')
    }
  }).then(function(response){
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
      $scope.error = ""
    })
  };

  $scope.TWAcc = function(){
    if($scope.nameAcc.replace(/\s/g, '') !== '') {
      $http.get('/acc/show/'+localStorageService.get('username')).then((err, response)=>{
        if (err) {
          $scope.error = err
        }
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