// public/js/forgot.js

var forgNg = angular.module('forgot',[]);


forgNg.controller('forgot',['$scope','$http','$window',function ($scope,$http,$window) {
  $scope.datavalidate="Introduce un email válido";
  $scope.exito = false;
  $scope.textoBoton = 'Recuperar';
  $scope.funcionBoton = 'recoverEmail()';
  $scope.publicKey="6LcF1V0UAAAAAJ1_J88wxbd2FbGP1qbq3Rh22Ibi";

  $scope.recoverEmail = function() {
    $scope.alert = false;
    console.log("entro en recuperar cuenta")
    if($scope.Datos !== undefined && $scope.Datos.email !== "" && $scope.Datos.email !== undefined){
        $http.post('/users/recover', $scope.Datos)
            .success(function (data) {
            //OK
            $scope.exito = true;
            })
            .error(function (data) {
            $scope.datavalidate = data;
            $scope.alert = true;
            $scope.exito = false;
            })
    };
  }

  $scope.vuelta = function () {
    $window.location.href('/');
  }
}]);