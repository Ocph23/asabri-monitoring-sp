angular
  .module("admin.controllers", [])

  .controller("adminController", adminController)
  
  .controller("adminHomeController", adminHomeController)
  .controller("adminBankController", adminBankController)
  .controller("adminMitraBayarController", adminMitraBayarController)
  
  .controller("MitraBayarDialogController",MitraBayarDialogController)

  .controller("adminSuratBayarController",adminSuratBayarController)
  .controller("adminAddSuratBayarController",adminAddSuratBayarController)
  .controller("adminEditSuratBayarController",adminEditSuratBayarController)
  ;

function adminController($scope,$mdDialog) {
  $scope.toggle = {};
}

function adminHomeController($scope, $state, $mdDialog) {
  $scope.showAdvanced = function(ev) {
    $mdDialog
      .show({
        controller: DialogController,
        templateUrl: "../apps/views/admin/admin-add-petugas.template.html",
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(
        function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        },
        function() {
          $scope.status = "You cancelled the dialog.";
        }
      );
  };
}

function adminBankController($scope, $state, message, $mdDialog, BankService) {
  BankService.get().then(x => {
    $scope.datas = x;
  });


  $scope.print=function()
  {
    window.print();
  }

  $scope.change = function(ev, data) {
    $mdDialog
      .show({
        locals: { dataToPass: data },
        controller: DialogController,
        templateUrl: "../apps/views/admin/admin-add-bank-template.html",
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(
        function(model) {
            if(model.idBank){
                BankService.put(model).then(
                    x => {
                      message.info("Edit Data");
                    },
                    err => {}
                  );
            }else{
                BankService.post(model).then(
                    x => {
                      message.info("Edit Data");
                    },
                    err => {}
                  );
            }
        
        },
        function() {
          $scope.status = "You cancelled the dialog.";
        }
      );
  };
}

function adminMitraBayarController($scope,MitraBayarService, BankService, message, $mdDialog,){

  MitraBayarService.get().then(x=>{
    $scope.datas= x;
  });

  $scope.change = function(ev, data) {
    $mdDialog
      .show({
        locals: { dataToPass: data },
        controller: MitraBayarDialogController,
        templateUrl: "../apps/views/admin/admin-add-mitrabayar.template.html",
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(
        function(model) {
            if(model.idBank){
                BankService.put(model).then(
                    x => {
                      message.info("Edit Data");
                    },
                    err => {}
                  );
            }else{
                BankService.post(model).then(
                    x => {
                      message.info("Edit Data");
                    },
                    err => {}
                  );
            }
        
        },
        function() {
          $scope.status = "You cancelled the dialog.";
        }
      );
  };

  
}

function MitraBayarDialogController($scope, $mdDialog, dataToPass) {
  if (dataToPass) {
    $scope.model = angular.copy(dataToPass);
  }
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(model) {
    $mdDialog.hide(model);
  };
  
}

function adminSuratBayarController($scope,SuratBayarService){
  SuratBayarService.get().then(x => {
    $scope.datas = x;
  });
}

function adminAddSuratBayarController($scope,BankService)
{
  BankService.get().then(banks=>{
    $scope.banks=banks;
  });
}

function adminEditSuratBayarController($scope,$stateParams, $state,  SuratBayarService, BankService)
{
  var id = $stateParams.id;
  BankService.get().then(banks=>{
    $scope.banks=banks;
    SuratBayarService.getById(id).then(x=>{
      $scope.model=x;
    });
  });
  
  $scope.getTerbilang=function(data){
      return terbilang(data)+" Rupiah";
  }

}