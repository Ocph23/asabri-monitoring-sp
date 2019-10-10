angular
  .module("sp.service", [])

  .factory("SuratBayarService", SuratBayarService);

function SuratBayarService($q, $http,helperServices,AuthService) {
  var instance = false;
  var datas = [];

  function get() {
    var def = $q.defer();

    if (!instance) {
      $http({
        method: "GET",
        url: helperServices.url + "/api/sp",
        headers: AuthService.getHeader()
      }).then(
        x => {
          instance=true;
          datas = x.data;
          def.resolve(datas);
        },
        err => {
          helperServices.errorHandler(err);
        }
      );
    } else {
      def.resolve(datas);
    }

    return def.promise;
  }

  function getById(id) {
    var def = $q.defer();
    try {
      if(instance)
      {
        var data = datas.find(x => x.idSuratPembayaran == id);
        if (data) {
          def.resolve(data);
        } else {
          throw Error("Data Tidak Ditemukan");
        }
      }else{
        $http({
          method: "GET",
          url: helperServices.url + "/api/sp/"+id,
          headers: AuthService.getHeader()
        }).then(
          res => {
            if (res) {
              def.resolve(res.data);
            } else {
              throw Error("Data Tidak Ditemukan");
            }
          },
          err => {
            helperServices.errorHandler(err);
          }
        );
      }
     
    } catch (error) {
        helperServices.errorHandler(err);
    }
    return def.promise;
  }

  function post(data) {
    var def = $q.defer();
    $http({
      method: "POST",
      url: helperServices.url + "/api/sp",
      headers: AuthService.getHeader(),
      data: data
    }).then(
      x => {
        datas.push(x.data);
        def.resolve(data);
      },
      err => {
        helperServices.errorHandler(err);
      }
    );

    return def.promise;
  }

  function put(data) {
    var def = $q.defer();
    try {
      $http({
        method: "PUT",
        url: helperServices.url + "/api/sp/" + data.idSuratPembayaran,
        headers: AuthService.getHeader(),
        data: data
      }).then(
        res => {
          var dataInCollection = datas.find(x => x.idSuratPembayaran == data.idSuratPembayaran);
          if (dataInCollection) {
            dataInCollection=res;
            def.resolve(res);
          } else {
            def.resolve(res);
          }
        },
        err => {
          helperServices.errorHandler(err);
        }
      );
    } catch (error) {
        helperServices.errorHandler(err);
    }

    return def.promise;
  }

  function remove(data) {
    var def = $q.defer();
    try {
      var index = datas.indexOf(data);
      datas.splice(index, 1);
      def.resolve(true);
    } catch (err) {
      helperServices.errorHandler(err);
    }
    return def.promise;
  }

  function cariByKodeBayar(kode){
    var def = $q.defer();
    try {
      $http({
        method: "GET",
        url: helperServices.url + "/api/sp/kodebayar/"+kode,
        headers: AuthService.getHeader()
      }).then(
        res => {
          if (res) {
            def.resolve(res.data);
          } else {
            throw Error("Data Tidak Ditemukan");
          }
        },
        err => {
          def.reject(err);
        }
      );
     
    } catch (err) {
      def.reject(err);
    }
    return def.promise;
  }

  function cariByNomorSP(kode){
    var def = $q.defer();
    try {
      $http({
        method: "POST",
        url: helperServices.url + "/api/sp/nomorsp",
        headers: AuthService.getHeader(),
        data:{nomor:kode}
      }).then(
        res => {
          if (res) {
            def.resolve(res.data);
          } else {
            throw Error("Data Tidak Ditemukan");
          }
        },
        err => {
          def.reject(err);
        }
      );
     
    } catch (error) {
       def.reject(error.message);
    }
    return def.promise;
  }


  function createPembayaran(model){
    var def = $q.defer();
    $http({
      method: "POST",
      url: helperServices.url + "/api/sp/pembayaran",
      headers: AuthService.getHeader(),
      data: model
    }).then(
      x => {
        def.resolve(x);
      },
      err => {
        helperServices.errorHandler(err);
      }
    );

    return def.promise;
  }

  function getPembayaran(id){
    var def = $q.defer();
    try {
      $http({
        method: "GET",
        url: helperServices.url + "/api/sp/pembayaran/"+id,
        headers: AuthService.getHeader(),
      }).then(
        res => {
          if (res) {
            def.resolve(res.data);
          } else {
            def.resolve(null);
          }
        },
        err => {
          def.reject(err);
        }
      );
     
    } catch (error) {
       def.reject(error.message);
    }
    return def.promise;
  }


  function getLaporanTerbayar(){
    var def = $q.defer();
    try {
      $http({
        method: "GET",
        url: helperServices.url + "/api/sp/laporanterbayar/true",
        headers: AuthService.getHeader(),
      }).then(
        res => {
          if (res) {
            def.resolve(res.data);
          } else {
            def.resolve(null);
          }
        },
        err => {
          def.reject(err);
        }
      );
     
    } catch (error) {
       def.reject(error.message);
    }
    return def.promise;
  }

  return {
    get: get,
    getLaporanTerbayar:getLaporanTerbayar,
    getByKodeBayar:cariByKodeBayar,
    getByNomorSP:cariByNomorSP,
    getById: getById,
    post: post,
    put: put,getPembayaran:getPembayaran,
    remove: remove, createPembayaran:createPembayaran
  };
}
