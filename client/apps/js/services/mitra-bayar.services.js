angular
  .module("mitraBayar.service", [])
  .factory("MitraBayarService", MitraBayarService);

function MitraBayarService($q, $http, helperServices, AuthService) {
  var instance = false;
  var datas = [];
  get();

  function get() {
    var def = $q.defer();

    if (!instance) {
      $http({
        method: "GET",
        url: helperServices.url + "/api/mitra",
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
      url: helperServices.url + "/api/mitra",
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

  function put(data) {
    var def = $q.defer();
    try {
      $http({
        method: "PUT",
        url: helperServices.url + "/api/mitra/" + data.idMitrabayar,
        headers: AuthService.getHeader(),
        data: data
      }).then(
        x => {
          var dataInCollection = datas.find(
            x => x.idMitrabayar == data.idMitrabayar
          );
          if (dataInCollection) {
            dataInCollection.nama = data.nama;
            dataInCollection.kode = data.kode;
            dataInCollection.email = data.email;
            dataInCollection.alamat = data.alamat;
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
      var index = datas.indexOf(data);
      datas.splice(index, 1);
      def.resolve(true);
    } catch (err) {
      helperServices.errorHandler(err);
        def.reject(err);
    }
    return def.promise;
  }

  function getUsers(id) {
    var def = $q.defer();
    $http({
      method: "GET",
      url: helperServices.url + "/api/auth/UsersByMitraBayar/" + id,
      headers: AuthService.getHeader()
    }).then(
      x => {
        def.resolve(x.data);
      },
      err => {
        helperServices.errorHandler(err);
        def.reject(err);
      }
    );
    return def.promise;
  }

  return {
    get: get,
    getUsers: getUsers,
    post: post,
    put: put,
    remove: remove
  };
}
