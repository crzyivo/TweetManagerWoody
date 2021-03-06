//public/frontend/js/navs.js
var navNg = angular.module('navs',['LocalStorageModule']);
navNg.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('loginNg')
        .setStorageType('sessionStorage')
        .setNotify(true, true);
});

navNg.directive('topBar',function () {
    var controller = ['$scope','$window','localStorageService',function($scope,$window,localStorageService) {

        $scope.logout=function () {
            console.log('hi');
            localStorageService.remove('username');
            localStorageService.remove('cuentas');
            localStorageService.remove('account');
            $window.location.href = '/logout';
        };
        $scope.redirect = function(redirection){
          $window.location.href = redirection
      }
    }];
    return {
        controller: controller,
        restrict: 'E',
        templateUrl: '../pages/topbar.html'
    }
});

navNg.directive('sideBar',function () {
    var controller = ['$scope','$http','$window','localStorageService',function($scope, $http, $window, localStorageService) {
      $scope.nameAcc = " ";
      $scope.error = "";
      $scope.cuentas = {};
      if(localStorageService.get('cuentas')==="" || localStorageService.get('cuentas')===null) {
        $http.get('/acc', {
          params: {
            email: localStorageService.get('username')
          }
        }).then(function (response) {
          $scope.cuentas = response.data;
          localStorageService.set('cuentas', response.data);
        });
      }
      localStorageService.bind($scope,'cuentas');
      console.log($scope.cuentas);
      $scope.$on('LocalStorageModule.notification.setItem', function(event, parameters) {
        console.log(parameters);
        $scope.cuentas = parameters.newvalue;  // contains the new value
        console.log($scope.cuentas);
      });
      $scope.$on('LocalStorageModule.notification.removeitem',function(event, parameters) {
        console.log('remove');
        delete $scope.cuentas[parameters.key];
      });
      $scope.openAcc = function(account){
        localStorageService.set('account', account.account_name);
          $window.location.href = '/frontend/pages/cuenta?acc='+account.account_name;
      };
      $scope.redirect = function(redirection){
          $window.location.href = redirection
      } 
    }];
    return{
        controller: controller,
        restrict: 'E',
        templateUrl: '../pages/sidebar.html'
    }
});