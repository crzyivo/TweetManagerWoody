//frontend/js/indexAdmin.js

var indexAdmin = angular.module('indexAd');

indexAdmin.controller('index',['$scope','$http','$window','localStorageService','$rootScope','$location',function($scope, $http, $window, localStorageService,$rootScope,$location) {

    if(localStorageService.get("username") ==="" || localStorageService.get("username") === null) {
        $http.get('/session', {})
            .success(function (data) {
              localStorageService.set('username', data.user);
              console.log(data);
            })
            .error(function (data) {
              $scope.error = "Login incorrecto";
              console.log(data);
            });
    }
    $scope.nameAcc = " ";
    $scope.error = "";
    $scope.users = {};
    $scope.cuentas = {};
    $http.get('/users/users').then(function(response){
        var indexAux = response.data.map((user)=>{return user.admin}).indexOf(true)
        $scope.users = response.data
        if(indexAux > -1){
        $scope.users.splice(indexAux,1)
        }
        $scope.cuentas = $scope.users.map((user) => {
        console.log(user)
        return user.email
        });
        $scope.users = $scope.users.map((user) => {
        console.log(user)
        return {
            nombre: user.nombre,
            apellidos: user.apellidos,
            email: user.email,
            ultimoAcceso: new Date(user.ultimoAcceso).toLocaleString(),
            entradaApp: new Date(user.entradaApp).toLocaleString()
            
            }
        })
        localStorageService.set('cuentas', $scope.users);
        $rootScope.$broadcast('LocalStorageModule.notification.setItem',{key: 'loginNg.cuentas', newvalue: $scope.cuentas})
    });

    $scope.openAcc = function(account){
        var aux = $scope.users.map((acc)=> {return acc.email}).indexOf(account);
        if(aux !== -1){
            localStorageService.set('account', account);
            console.log(aux); 
        // redirige siempre aquí aunque borres la cuenta porque no se actualiza
        }
    };

    $scope.deleteAcc = function(account){
        $http.get('/users/deleteUser', {
        params: {
            email: account
        }
        }).then(function(response){
        console.log(response)
        var indexAux = response.data.map((user)=>{return user.admin}).indexOf(true)
        $scope.users = response.data
        if(indexAux > -1){
            $scope.users.splice(indexAux,1)
        }
        $scope.cuentas = $scope.users.map((user) => {
            console.log(user)
            return user.email
        });
        $scope.users = $scope.users.map((user) => {
            return {
                nombre: user.nombre,
                apellidos: user.apellidos,
                email: user.email,
                entradaApp: new Date(user.entradaApp).toLocaleString(),
            ultimoAcceso: new Date(user.ultimoAcceso).toLocaleString()
            }
        })
        localStorageService.set('cuentas', $scope.users);
        $rootScope.$broadcast('LocalStorageModule.notification.setItem',{key: 'loginNg.cuentas', newvalue: $scope.cuentas});
        })
    };
}]);