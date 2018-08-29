angular.module('app', ['chart.js','LocalStorageModule','navs']);

angular.module("app").controller("BarCtrl",['$scope','$http','$window','localStorageService',function($scope,$http,$window,localStorageService) {
    $scope.labels = [];
    $scope.labels2 = [];

    $http.get('/acc/twits/home/'+localStorageService.get('username')
    ).then(function(response){
      $scope.tweets = response.data; // Los 40 últimos tweets posteados por el usuario en cada cuenta
      $http.put('/acc/calc',{datos: response.data}).then(function(response){
          $scope.data = response.data.datos
          $scope.data2 = response.data.datos2
          $scope.labels = response.data.labels
          $scope.labels2 = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']
      })});

  }]);

angular.element(document).ready(function(){
  angular.bootstrap(document, ['app']);
});