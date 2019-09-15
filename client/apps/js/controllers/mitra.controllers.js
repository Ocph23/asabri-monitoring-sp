angular
  .module("mitra.controllers", [])

  .controller("mitraController", mitraController)
  .controller("mitraHomeController", mitraHomeController)
  .controller("mitraSuratBayarController", mitraSuratBayarController)
  .controller("mitraCariController", mitraCariController)
  .controller("mitraSPController",mitraSPController);

function mitraController($scope, AuthService) {
  AuthService.me().then(x => {
    $scope.me = x;
  });
}

function mitraHomeController($scope, $state) {}

function mitraSuratBayarController() {}

function mitraCariController($scope,$state, SuratBayarService) {
  $scope.Cari = function(nomor,sbb) {
      if(sbb)
      {
        SuratBayarService.getByNomorSP(nomor).then(x=>{
            $state.go("mitra-sp",{id:x.idSuratPembayaran});
        },err=>{
            $scope.error=true;
        })
      }else{
        SuratBayarService.getByKodeBayar(nomor)
        .then(x=>{
            $state.go("mitra-sp",{id:x.idSuratPembayaran});
        },err=>{
            $scope.error=true;
        })
      }

  };
}


function mitraSPController($scope,SuratBayarService,$stateParams, BankService){
    var id = $stateParams.id;
    BankService.get()
    .then(x=>{
        $scope.banks=x;
        SuratBayarService.getById(id)
        .then(res=>{
            $scope.model=res;
        })
    
    })
    $scope.getTerbilang = function(data) {
        if (data && data > 0) {
          return terbilang(data) + " Rupiah";
        } else {
          return "";
        }
      };

}
