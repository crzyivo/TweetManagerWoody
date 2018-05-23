//public/js/login.js

var loginNg = angular.module('login',[]);

function mainLogin($scope,$http) {
  $scope.loginData = {};
  
  $scope.loginSubmit = function () {
    $http.get('/login',{
      params: $scope.loginData
    })
        .success(function (data) {
          window.location.href= ("/frontend/index");
        })
        .error(function (data) {
          console.log(data);
        });
  };
}