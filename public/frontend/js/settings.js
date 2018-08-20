// public/frontend/js/settings.js

var setNg = angular.module('perfil',[]);

setNg.controller('perfilCtrl',['$scope','$http','$window',function ($scope,$http,$window) {
    var init = function () {
        $http.get('/users')
            .success(function(response){
                $scope.nombre = response.nombre;
                $scope.apellidos=response.apellidos;
                $scope.email=response.email;
            })
    };
    $scope.passSubmit = function(){
        $scope.same=false;
        if ($scope.password1 !== $scope.password2) {
            $scope.same=true;

        } else {
            // $http.put('/users', {
            //     password: CryptoJS.SHA256($scope.password1).toString(CryptoJS.enc.Base64)
            // })
            //     .success(function (data) {
            //         $window.location.href=data.next;
            //     })
            //     .error(function (data) {
            //     })
        }
    };
    init();
}]);

