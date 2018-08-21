var navNg = angular.module('navs',[]);

navNg.directive('topBar',function () {
    return {
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