angular
  .module("bank.service", [])

  .factory("BankService", BankService);

function BankService($q, $http, helperServices, AuthService) {
  var instance = false;
  get();

  function get() {
    var def = $q.defer();

    if (!instance) {
      $http({
        method: "GET",
        url: helperServices.url + "/api/bank",
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
      url: helperServices.url + "/api/bank",
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
        url: helperServices.url + "/api/bank/" + data.idBank,
        headers: AuthService.getHeader(),
        data: data
      }).then(
        x => {
          var dataInCollection = datas.find(x => x.idBank == data.idBank);
          if (dataInCollection) {
            dataInCollection.nama = data.nama;
            dataInCollection.kodeBank = data.kodeBank;
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
        url: helperServices.url + "/api/bank/" + data.idBank,
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
  return {
    get: get,
    post: post,
    put: put,
    remove: remove
  };
}
