//public/js/login.js

var loginNg = angular.module('login',['LocalStorageModule']);

loginNg.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
      .setPrefix('loginNg')
      .setStorageType('sessionStorage')
});

loginNg.controller('mainLogin',['$scope','$http','$window','localStorageService',function($scope,$http,$window,localStorageService) {
  $scope.loginData = {};
  $scope.loginSubmit = function () {
    var login = $scope.loginData;
    $http.get('/login', {
      params: {
        username: login.username,
        password: CryptoJS.SHA256(login.password).toString(CryptoJS.enc.Base64)
      }
    })
        .success(function (data) {
          localStorageService.set('username',data.username);
          console.log(data);
          $window.location.href = data.next;
        })
        .error(function (data) {
          $scope.error = "Login incorrecto";
          console.log(data);
        });
  };
}]);

loginNg.controller('firstLogin',['$scope','$http','$window','localStorageService',
  function($scope,$http,$window,localStorageService) {
  $scope.cambioSubmit = function () {
    console.log(localStorageService.get('username'));
    console.log($scope.password1);
    console.log($scope.password2);
    if ($scope.password1 !== $scope.password2) {
      $scope.datavalidate = "Las contraseñas no coinciden";
      $scope.alert = true;

    } else {
      $http.put('users', {
          email: localStorageService.get('username'),
          password: CryptoJS.SHA256($scope.password1).toString(CryptoJS.enc.Base64)
      })
          .success(function (data) {
            $window.location.href("/frontend/index");
          })
          .error(function (data) {
          })
    }
  }
}]);