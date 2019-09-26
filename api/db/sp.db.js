const pool = require("./dbconnection");
const helper = require("../helper");

const db = {};

db.get = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `
      SELECT
        suratpembayaran.idSuratPembayaran,
        suratpembayaran.berlakuDariTanggal,
        suratpembayaran.berlakuSampaiTanggal,
        suratpembayaran.nomorSurat,
        suratpembayaran.kodeBayar, suratpembayaran.jumlah,
        suratpembayaran.idBank, suratpembayaran.jenisAsuransi,  
        suratpembayaran.statusPenerima,suratpembayaran.namaPenerima, suratpembayaran.noRekening,
        If(IsNull(pembayaran.tanggalBayar), If(Date(now()) <
        Date(suratpembayaran.berlakuSampaiTanggal), "aktif", "kadaluwarsa"),
        "terbayar") AS status
      FROM
        suratpembayaran LEFT JOIN
        pembayaran ON suratpembayaran.idSuratPembayaran =
          pembayaran.idSuratPembayaran;`,
      (err, result) => {
        if (err) reject(err);
        if (result) return resolve(result);
      }
    );
  });
};

db.getById = id => {
  return new Promise(async (resolve, reject) => {
    pool.query(
      `SELECT
        suratpembayaran.idSuratPembayaran,
        suratpembayaran.berlakuDariTanggal,
        suratpembayaran.berlakuSampaiTanggal,
        suratpembayaran.nomorSurat,
        suratpembayaran.kodeBayar, suratpembayaran.jumlah,
        suratpembayaran.idBank, suratpembayaran.jenisAsuransi, 
        suratpembayaran.statusPenerima,suratpembayaran.namaPenerima, suratpembayaran.noRekening, 
        If(IsNull(pembayaran.tanggalBayar), If(now() <
        Date(suratpembayaran.berlakuSampaiTanggal), "aktif", "kadaluwarsa"),
        "terbayar") AS status
      FROM
        suratpembayaran LEFT JOIN
        pembayaran ON suratpembayaran.idSuratPembayaran =
          pembayaran.idSuratPembayaran 
      Where suratpembayaran.idSuratPembayaran= ?;`,
      [id],
      (err, result) => {
        if (err) return reject(err);
        else return resolve(result[0]);
      }
    );
  });
};

db.getByKodeBayar = id => {
  return new Promise(async (resolve, reject) => {
    pool.query(
      `SELECT
        suratpembayaran.idSuratPembayaran,
        suratpembayaran.berlakuDariTanggal,
        suratpembayaran.berlakuSampaiTanggal,
        suratpembayaran.nomorSurat,
        suratpembayaran.kodeBayar, suratpembayaran.jumlah,
        suratpembayaran.idBank, suratpembayaran.jenisAsuransi,  
        suratpembayaran.statusPenerima,suratpembayaran.namaPenerima, suratpembayaran.noRekening,
        If(IsNull(pembayaran.tanggalBayar), If(now() <
        Date(suratpembayaran.berlakuSampaiTanggal), "aktif", "kadaluwarsa"),
        "terbayar") AS status
      FROM
        suratpembayaran LEFT JOIN
        pembayaran ON suratpembayaran.idSuratPembayaran =
          pembayaran.idSuratPembayaran 
      Where suratpembayaran.kodeBayar= ?;`,
      [id],
      (err, result) => {
        if (err) return reject(err);
        else return resolve(result[0]);
      }
    );
  });
};

db.getByNomorSP = id => {
  return new Promise(async (resolve, reject) => {
    pool.query(
      `SELECT
        suratpembayaran.idSuratPembayaran,
        suratpembayaran.berlakuDariTanggal,
        suratpembayaran.berlakuSampaiTanggal,
        suratpembayaran.nomorSurat,
        suratpembayaran.kodeBayar, suratpembayaran.jumlah,
        suratpembayaran.idBank, suratpembayaran.jenisAsuransi,  
        suratpembayaran.statusPenerima,suratpembayaran.namaPenerima, suratpembayaran.noRekening,
        If(IsNull(pembayaran.tanggalBayar), If(now() <
        Date(suratpembayaran.berlakuSampaiTanggal), "aktif", "kadaluwarsa"),
        "terbayar") AS status
      FROM
        suratpembayaran LEFT JOIN
        pembayaran ON suratpembayaran.idSuratPembayaran =
          pembayaran.idSuratPembayaran 
      Where suratpembayaran.nomorSurat= ?;`,
      [id],
      (err, result) => {
        if (err) return reject(err);
        else return resolve(result[0]);
      }
    );
  });
};

db.getNasabagByidsp = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from peserta where idSuratPembayaran=?",
      [id],
      (err, result) => {
        if (err) reject(err);
        if (result) return resolve(result[0]);
      }
    );
  });
};

db.insert = param => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      connection.beginTransaction(error => {
        if (error) reject(error);
        connection.query(
          `insert into suratpembayaran (berlakuDariTanggal,berlakuSampaiTanggal,idBank,
              nomorSurat, kodeBayar,jumlah,jenisAsuransi,namaPenerima,noRekening,statusPenerima) values(?,?,?,?,?,?,?,?,?,?)`,
          [
            param.berlakuDariTanggal,
            param.berlakuSampaiTanggal,
            param.idBank,
            param.nomorSurat,
            param.kodeBayar,
            param.jumlah,
            param.jenisAsuransi,
            param.namaPenerima,
            param.noRekening,
            param.statusPenerima
          ],
          (err, result) => {
            if (err) {
              connection.rollback(function() {
                connection.release();
                reject(err);
              });
            }

            if (result && result.insertId > 0) {
              param.idSuratPembayaran = result.insertId;
              param.nasabah.idSuratPembayaran = result.insertId;
              const nas = param.nasabah;
              connection.query(
                `insert into peserta (idSuratPembayaran,nama, pangkat,nomorPeserta, 
                  tanggalLahir,tanggalSKEP,tanggalPensiun,kodeJiwa,alamat) values(?,?,?,?,?,?,?,?,?)`,
                [
                  nas.idSuratPembayaran,
                  nas.nama,
                  nas.pangkat,
                  nas.nomorPeserta,
                  nas.tanggalLahir,
                  nas.tanggalSKEP,
                  nas.tanggalPensiun,
                  nas.kodeJiwa,
                  nas.alamat
                ],
                (err1, result1) => {
                  if (err1) {
                    connection.rollback(function() {
                      connection.release();
                      reject(err1);
                    });
                  }
                  if (result1 && result1.insertId > 0) {
                    param.nasabah.idNasabah = result1.insertId;
                    connection.commit(function(err) {
                      connection.release();
                      if (err) {
                        reject(err);
                      } else {
                        return resolve(param);
                      }
                    });
                  }
                }
              );
            }
          }
        );
      });
    });
  });
};

db.update = param => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection, next) => {
      if (err) reject(err);
      connection.beginTransaction(error => {
        if (error) reject(err);
        connection.query(
          `update suratPembayaran set berlakuDariTanggal=?,berlakuSampaiTanggal=?,idBank=?,
          nomorSurat=?, kodeBayar=?,jumlah=?, namaPenerima=?, noRekening=?, statusPenerima=?, jenisAsuransi=? where idSuratPembayaran=?`,
          [
            param.berlakuDariTanggal,
            param.berlakuSampaiTanggal,
            param.idBank,
            param.nomorSurat,
            param.kodeBayar,
            param.jumlah,
            param.namaPenerima,
            param.noRekening,
            param.statusPenerima,
           param.jenisAsuransi,
            param.idSuratPembayaran
          ],
          (err, result) => {
            if (err) {
              connection.rollback(function() {
                connection.release();
                reject(err);
              });
            }

            if (result) {
              const nas = param.nasabah;
              connection.query(
                `update peserta set nama=?, pangkat=?,nomorPeserta=?, 
                  tanggalLahir=?,tanggalSKEP=?,tanggalPensiun=?,kodeJiwa=?, alamat=? where idPeserta=?`,
                [
                  nas.nama,
                  nas.pangkat,
                  nas.nomorNasabah,
                  nas.tanggalLahir,
                  nas.tanggalSKEP,
                  nas.tanggalPensiun,
                  nas.kodeJiwa,
                  nas.alamat,
                  nas.idNasabah
                ],
                (err1, result1) => {
                  if (err1) {
                    connection.rollback(function() {
                      connection.release();
                      reject(err1);
                    });
                  }

                  if (result1) {
                    connection.commit(function(err) {
                      connection.release();
                      if (err) {
                        reject(err);
                      } else {
                        return resolve(param);
                      }
                    });
                  }
                }
              );
            }
          }
        );
      });
    });
  });
};
db.delete = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      "delete from suratPembayaran where idSuratPembayaran= ?",
      [id],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        if (result) {
          return resolve(true);
        }
        return reject("Data Tidak Tersimpan");
      }
    );
  });
};

db.createPembayaran = param => {
  return new Promise((resolve, reject) => {
    pool.query(
      `insert into pembayaran (idSuratPembayaran,idMitraBayar,tanggalBayar, nomorBuktiBayar,buktiBayar,idUserMitraBayar)
        values(?,?,?,?,?,?)`,
      [
        param.idSuratPembayaran,
        param.idMitraBayar,
        param.tanggalBayar,
        param.nomorBuktiBayar,
        param.buktiBayar,
        param.idUserMitraBayar
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result) {
          return resolve(true);
        }
        return reject("Data Tidak Tersimpan");
      }
    );
  });
};


db.getPembayaran=id=>{
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from pembayaran where idSuratPembayaran=?",
      [id],
      (err, result) => {
        if (err) reject(err);
        if (result) return resolve(result[0]);
      }
    );
  });
}


db.laporanTerbayar=()=>{
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT
      suratpembayaran.berlakuDariTanggal, suratpembayaran.kodeBayar,
      suratpembayaran.namaPenerima, suratpembayaran.jenisAsuransi,
      suratpembayaran.jumlah, suratpembayaran.nomorSurat,
      pembayaran.nomorBuktiBayar, mitrabayar.kode as kodeMitraBayar, mitrabayar.nama as namaMitraBayar,
      peserta.nama, pembayaran.tanggalBayar, bank.nama as namaBank,
      bank.kodeBank
    FROM
      suratpembayaran LEFT JOIN
      pembayaran ON suratpembayaran.idSuratPembayaran =
        pembayaran.idSuratPembayaran LEFT JOIN
      mitrabayar ON pembayaran.idMitraBayar = mitrabayar.idMitraBayar
      LEFT JOIN
      peserta ON suratpembayaran.idSuratPembayaran =
        peserta.idSuratPembayaran LEFT JOIN
      bank ON mitrabayar.idBank = bank.idBank
    where pembayaran.tanggalBayar is not null;`,
      (err, result) => {
        if (err) reject(err);
        if (result) return resolve(result);
      }
    );
  });
}

module.exports = db;
