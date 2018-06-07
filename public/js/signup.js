// public/js/signup.js

var regNg = angular.module('signup',['vcRecaptcha']);


regNg.controller('registro',['$scope','$http','$window','vcRecaptchaService',function ($scope,$http,$window,$vcRecaptchaService) {
  $scope.datavalidate="Introduce un email válido";
  $scope.exito = false;
  $scope.introduceCaptcha = false;
  $scope.textoBoton = 'Crear cuenta';
  $scope.funcionBoton = 'nuevaCuenta()';
  $scope.publicKey="6LcF1V0UAAAAAJ1_J88wxbd2FbGP1qbq3Rh22Ibi";

  $scope.setWidget = function(widgetId){
    $scope.widgetId = widgetId;
  };

  $scope.nuevaCuenta = function() {
    if($vcRecaptchaService.getResponse()===""){
      $scope.introduceCaptcha=true;
    }else {
      $scope.Datos.gRecaptcha = $vcRecaptchaService.getResponse();
      $http.post('/users', $scope.Datos)
          .success(function (data) {
            //OK
            $scope.introduceCaptcha=false;
            $scope.exito = true;
            $scope.textoBoton = 'Logeate';
            $scope.funcionBoton = 'vuelta()';
          })
          .error(function (data) {
            $vcRecaptchaService.reload($scope.widgetId);
            $scope.introduceCaptcha=false;
            $scope.datavalidate = "Este email ya esta en uso";
            $scope.alert = true;
          })
    }
  };
  $scope.vuelta = function () {
    $window.location.href('/');
  }
}]);