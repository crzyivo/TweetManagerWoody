var navNg = angular.module('navs',['LocalStorageModule']);
navNg.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('loginNg')
        .setStorageType('sessionStorage')
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
    return{
        restrict: 'E',
        templateUrl: '../pages/sidebar.html'
    }
});