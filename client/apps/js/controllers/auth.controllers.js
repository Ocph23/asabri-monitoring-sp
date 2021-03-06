angular.module('auth.controllers', [])
.controller('LoginController', LoginController);

function LoginController($scope, $state, AuthService) {
	$scope.login = function(user) {
		AuthService.login(user).then((x) => {
			$state.go(x.role + '-home');
		});
	}
}