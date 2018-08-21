//frontend/js/indexUser.js

var indexUser = angular.module('indexUs',[]);

indexUser.controller('index',['$scope','$http','$window',function($scope,$http,$window) {

  $http.get('/acc', {
    params: {
      email: "santiaguitomoron@hotmail.com"
    }
  }).then(function(response){
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