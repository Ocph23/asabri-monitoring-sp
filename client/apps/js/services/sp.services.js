angular
  .module("sp.service", [])

  .factory("SuratBayarService", SuratBayarService);

function SuratBayarService($q) {
  var instance = false;
  var datas = [
    {
      idSuratBayar: 1,
      idBank: 1,
      masaBerlaku: { dari: new Date(), sampai: new Date() },
      nomorSurat: "125/Vss/VII/2019",
      kodeBayar: "ED33111THT12252",
      jumlah: 25000000,
      status: "berlaku",
      bank: { idBank: 1, kode: "0001", nama: "Bank Mandiri" },
      nasabah: {
        nama: "Budi Santoso",
        pangkat:"BIPDA",
        nomor:"12521",
        tanggalLahir:new Date(),
        tanggalSKEP:new Date(),
        tanggalPensiun:new Date(),
        kodeJiwa:"12525sss",
        alamat:"Jln. Sudirmana"
      }
    }
  ];
  get();

  function get() {
    var def = $q.defer();

    if (instance) {
      def.resolve(datas);
    } else {
      def.resolve(datas);
    }

    return def.promise;
  }

  function getById(id) {
    var def = $q.defer();
    try {
      var data = datas.find(x => x.idSuratBayar == id);
      if (data) {
        def.resolve(data);
      } else {
        throw Error("Data Tidak Ditemukan");
      }
    } catch (error) {
        def.reject(err);
    }
    return def.promise;
  }

  function post(data) {
    var def = $q.defer();

    if (true) {
      datas.push(data);
      def.resolve(data);
    } else {
      def.resolve(datas);
    }
    return def.promise;
  }

  function put(data) {
    var def = $q.defer();
    var dataInCollection = datas.find(x => x.idBank == data.idBank);
    if (dataInCollection) {
      dataInCollection.nama = data.nama;
      dataInCollection.kode = data.kode;
      def.resolve(data);
    } else {
      def.resolve(datas);
    }
    return def.promise;
  }

  function remove(data) {
    var def = $q.defer();
    try {
      var index = datas.indexOf(data);
      datas.splice(index, 1);
      def.resolve(true);
    } catch (error) {
      def.reject(error);
    }
    return def.promise;
  }

  return {
    get: get,
    getById: getById,
    post: post,
    put: put,
    remove: remove
  };
}
