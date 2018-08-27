// public/frontend/js/settings.js

var setNg = angular.module('indexAd');

setNg.controller('perfilCtrl',['$scope','$http','$window','localStorageService',function ($scope,$http,$window, localStorageService) {
    var init = function () {
        $http.get('/users', {params:{email: localStorageService.get('account')}})
            .success(function(response){
                $scope.nombre = response.nombre;
                $scope.apellidos=response.apellidos;
                $scope.email=response.email;
                $scope.oldEmail = response.email;
            })
    };
    $scope.passSubmit = function(){
        $scope.same=false;
        $scope.changed=false;
        $scope.failure=false;
        if ($scope.password1 !== $scope.password2) {
            $scope.same=true;

        } else {
            $scope.password1 = CryptoJS.SHA256($scope.password2).toString(CryptoJS.enc.Base64)
            $http.put('/users/users', {
                nombre: $scope.nombre,
                apellidos: $scope.apellidos,
                email: $scope.oldEmail,
                newEmail: $scope.email,
                password: $scope.password1
            })
                .success(function (data) {
                    $scope.changed=true;
                    $scope.password1="";
                    $scope.password2="";
                    $scope.oldEmail = $scope.email
                    localStorageService.set('account', $scope.email)
                })
                .error(function (data) {
                    $scope.failure=true;
                    $scope.error = data.error
                    $scope.password1="";
                    $scope.password2="";
                })
        }
    };
    init();
}]);

