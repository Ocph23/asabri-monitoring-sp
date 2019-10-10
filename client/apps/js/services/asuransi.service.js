angular
  .module("asuransi.service", [])

  .factory("AsuransiService", AsuransiService);

function AsuransiService($q, $http, helperServices, AuthService) {
  var instance = false;
  var datas=[];
  get();

  function get() {
    var def = $q.defer();

    if (!instance) {
      $http({
        method: "GET",
        url: helperServices.url + "/api/asuransi",
        headers: AuthService.getHeader()
      }).then(
        x => {
          instance = true;
          datas = x.data;
          def.resolve(datas);
        },
        err => {
          helperServices.errorHandler(err);
          def.reject(err);
        }
      );
    } else {
      def.resolve(datas);
    }

    return def.promise;
  }

  function post(data) {
    var def = $q.defer();
    $http({
      method: "POST",
      url: helperServices.url + "/api/asuransi",
      headers: AuthService.getHeader(),
      data: data
    }).then(
      x => {
        datas.push(x.data);
        def.resolve(data);
      },
      err => {
        helperServices.errorHandler(err);
        def.reject(err);
      }
    );

    return def.promise;
  }

  function postManfaat(data) {
    var def = $q.defer();
    $http({
      method: "POST",
      url: helperServices.url + "/api/asuransi/manfaat",
      headers: AuthService.getHeader(),
      data: data
    }).then(
      x => {
        var dataInCollection = datas.find(x => x.idjenisAsuransi == data.idjenisAsuransi);
        dataInCollection.manfaat.push(x.data);
        def.resolve(x.data);
      },
      err => {
        helperServices.errorHandler(err);
        def.reject(err);
      }
    );

    return def.promise;
  }

  function put(data) {
    var def = $q.defer();
    try {
      $http({
        method: "PUT",
        url: helperServices.url + "/api/asuransi/" + data.idjenisAsuransi,
        headers: AuthService.getHeader(),
        data: data
      }).then(
        x => {
          var dataInCollection = datas.find(x => x.idjenisAsuransi == data.idjenisAsuransi);
          if (dataInCollection) {
            dataInCollection.namaAsuransi = data.namaAsuransi;
            dataInCollection.kodeAsuransi= data.kodeAsuransi;
            dataInCollection.pilihan = data.pilihan;
            def.resolve(data);
          } else {
            def.resolve(data);
          }
        },
        err => {
          helperServices.errorHandler(err);
          def.reject(err);
        }
      );
    } catch (error) {
      helperServices.errorHandler(err);
      def.reject(err);
    }

    return def.promise;
  }

  function putManfaat(data) {
    var def = $q.defer();
    try {
      $http({
        method: "PUT",
        url: helperServices.url + "/api/asuransi/manfaat/" + data.idjenisManfaat,
        headers: AuthService.getHeader(),
        data: data
      }).then(
        x => {
          var dataAsuransi = datas.find(x => x.idjenis == data.idjenisAsuransi);
          if (dataAsuransi) {
              var dataInCollection= dataAsuransi.manfaat.find(x=>x.idjenisManfaat==data.idjenisManfaat);
              if(dataInCollection)
              {
                dataInCollection.namaManfaat = data.namaManfaat;
                dataInCollection.kodeManfaat= data.kodeManfaat;
              }
            
            def.resolve(data);
          } else {
            def.resolve(data);
          }
        },
        err => {
          helperServices.errorHandler(err);
          def.reject(err);
        }
      );
    } catch (error) {
      helperServices.errorHandler(err);
      def.reject(err);
    }

    return def.promise;
  }

  function remove(data) {
    var def = $q.defer();
    try {
      $http({
        method: "Delete",
        url: helperServices.url + "/api/asuransi/" + data.idjenisAsuransi,
        headers: AuthService.getHeader()
      }).then(
        x => {
          var index = datas.indexOf(data);
          datas.splice(index, 1);
          def.resolve(true);
        },
        err => {
          helperServices.errorHandler(err);
          def.reject(err);
        }
      );
    } catch (err) {
      helperServices.errorHandler(err);
      def.reject(err);
    }
    return def.promise;
  }

  function removeManfaat(data) {
    var def = $q.defer();
    try {
      $http({
        method: "Delete",
        url: helperServices.url + "/api/asuransi/manfaat/" + data.idjenisManfaat,
        headers: AuthService.getHeader()
      }).then(
        x => {
         var dataAsuransi = datas.find(x => x.idjenisAsuransi == data.idjenisAsuransi);
         if(dataAsuransi)
         {
            var index = dataAsuransi.manfaat.indexOf(data);
            dataAsuransi.manfaat.splice(index, 1);
         }
        
          def.resolve(true);
        },
        err => {
          helperServices.errorHandler(err);
          def.reject(err);
        }
      );
    } catch (err) {
      helperServices.errorHandler(err);
      def.reject(err);
    }
    return def.promise;
  }


  return {
    get: get,
    post: post, postManfaat:postManfaat,
    put: put, putManfaat:putManfaat,
    remove: remove, removeManfaat:removeManfaat
  };
}
