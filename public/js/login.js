//public/js/login.js

var loginNg = angular.module('login',[]);

function mainLogin($scope,$http) {
  $scope.loginData = {};
  
  $scope.loginSubmit = function () {
    $http.get('/login',{
      params: $scope.loginData
    })
        .success(function (data) {
            loginNg.value("username", $scope.loginData.username);
            console.log(data);
            window.location.href = ("/frontend/index");
        })
        .error(function (data) {
          $scope.error= "Login incorrecto";
          console.log(data);
        });
  };

  function firstLogin($scope,$http,username) {
    $scope.password1;
    $scope.password2;
     if($scope.password1 === $scope.password2){
       $http.put('users',{
         body: {
           email: username,
           password: $scope.password1
         }
       })
           .success(function (data) {
             window.location.href("/frontend/index");
           })
     }
  }
}