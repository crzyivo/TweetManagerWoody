//public/frontend/js/index.js

var indexNg = angular.module('index',['LocalStorageModule','navs']);

indexNg.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('loginNg')
        .setStorageType('sessionStorage')
});

indexNg.controller('setSession',['$scope','$http','$window','localStorageService',function($scope,$http,$window,localStorageService) {
        $http.get('/session', {
        })
            .success(function (data) {
                localStorageService.set('username',data.user);
                console.log(data);
            })
            .error(function (data) {
                $scope.error = "Login incorrecto";
                console.log(data);
            });
}]);