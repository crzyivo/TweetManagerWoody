// public/js/signup.js

var regNg = angular.module('signup',[]);


regNg.controller('registro',['$scope','$http','$window',function ($scope,$http,$window) {
  $scope.datavalidate="Introduce un email válido";
  $scope.mostrar = false;
  $scope.textoBoton = 'Crear cuenta';
  $scope.funcionBoton = 'nuevaCuenta()';

  $scope.nuevaCuenta = function() {
    $http.post('/users', $scope.Datos)
        .success(function (data) {
          //OK
          $scope.mostrar=true;
          $scope.textoBoton='Logeate';
          $scope.funcionBoton='vuelta()';
        })
        .error(function (data) {
          $scope.datavalidate = "Este email ya esta en uso";
          $scope.alert = true;
        })
  };
  $scope.vuelta = function () {
    $window.location.href('/');
  }
}]);