angular.module("auth.controllers",[])

.controller("LoginController",LoginController)

function LoginController($scope,$state,AuthService){
  $scope.login=function(user){
    AuthService.login().then(x=>{
        $state.go(x.Role);
    })
  }
}

