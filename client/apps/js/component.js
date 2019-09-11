angular
  .module("app.conponent", [])

  .component("userlogin", {
    controller: function ($scope, AuthService) {
      this.userName = AuthService.getUserName();
      $scope.logoff = function () {
        AuthService.logOff();
      }

    },
    template: `<a href="" ng-click="logoff()">{{$ctrl.userName}}</a> <a href="" ng-click="logoff()"> Log Off</a>`
  });
