// public/frontend/js/settings.js

var setNg = angular.module('perfil',['LocalStorageModule','navs']);

setNg.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('loginNg')
        .setStorageType('sessionStorage')
        .setNotify(true, true);
});

setNg.controller('perfilCtrl',['$scope','$http','$window','LocalStorageModule',function ($scope,$http,$window, localStorageService) {
    var init = function () {
        $http.get('/users', {params:{email: localStorageService.get('account')}})
            .success(function(response){
                $scope.nombre = response.nombre;
                $scope.apellidos=response.apellidos;
                $scope.email=response.email;
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
                email: $scope.email,
                password: $scope.password1
            })
                .success(function (data) {
                    $scope.changed=true;
                    $scope.password1="";
                    $scope.password2="";
                })
                .error(function (data) {
                    $scope.failure=true;
                    $scope.password1="";
                    $scope.password2="";
                })
        }
    };
    init();
}]);

