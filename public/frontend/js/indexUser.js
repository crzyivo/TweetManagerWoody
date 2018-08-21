//frontend/js/indexUser.js

var indexUser = angular.module('indexUs',['LocalStorageModule']);

indexUser.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
      .setPrefix('loginNg')
      .setStorageType('sessionStorage')
});

indexUser.controller('index',['$scope','$http','$window','localStorageService',function($scope,$http,$window,localStorageService) {

  $http.get('/acc', {
    params: {
      email: localStorageService.get('username')
    }
  }).then(function(response){
    console.log(localStorageService.get('username'))
    $scope.cuentas = response.data
  })
}]);

indexUser.controller('firstLogin',['$scope','$http','$window',
  function($scope,$http,$window) {
  $scope.cambioSubmit = function () {
    console.log(localStorageService.get('username'));
    console.log($scope.password1);
    console.log($scope.password2);
    if ($scope.password1 !== $scope.password2) {
      $scope.datavalidate = "Las contraseñas no coinciden";
      $scope.alert = true;

    } else {
      $http.put('/users', {
          email: localStorageService.get('username'),
          password: CryptoJS.SHA256($scope.password1).toString(CryptoJS.enc.Base64)
      })
          .success(function (data) {
            $window.location.href=data.next;
          })
          .error(function (data) {
          })
    }
  }
}]);