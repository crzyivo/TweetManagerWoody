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
            $window.location.href = '/logout';
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
    }];
    return{
        controller: controller,
        restrict: 'E',
        templateUrl: '../pages/sidebar.html'
    }
});