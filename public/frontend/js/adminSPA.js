//frontend/js/adminSPA.js

var app = angular.module('indexAd',['ngRoute','LocalStorageModule','navs']);

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('loginNg')
        .setStorageType('sessionStorage')
        .setNotify(true, true);
  });

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl : '../pages/pruebaAdmin.html',
      controller  : 'index'
    })
  
    .when('/settingsAdmin', {
      templateUrl : '../pages/settingsAdminPrueba.html',
      controller  : 'perfilCtrl'
    })

    .when('/stats', {
      templateUrl : '../pages/statsAdminSPA.html',
      controller  : 'perfilCtrl'
    })
  
    .otherwise({redirectTo: '/'});
  });