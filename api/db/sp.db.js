const pool = require("./dbconnection");
const helper = require("../helper");

const db = {};

db.get = () => {
  return new Promise((resolve, reject) => {
    pool.query("select * from suratPembayaran", (err, result) => {
      if (err) reject(err);
      if (result) return resolve(result);
    });
  });
};

db.getById = id => {
  return new Promise(async (resolve, reject) => {
    pool.query(
      "select * from suratPembayaran where idSuratPembayaran=?",
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
      "select * from suratPembayaran where kodebayar=?",
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
      "select * from suratPembayaran where nomorsurat=?",
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
      "select * from nasabah where idSuratPembayaran=?",
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
    pool.getConnection((err, connection, next) => {
      try {
        if (err) next(err);
        if (connection) {
          connection.beginTransaction(error => {
            if (error) throw new Error("error");
            else {
              connection.query(
                `insert into suratpembayaran (berlakuDariTanggal,berlakuSampaiTanggal,idBank,
                    nomorSurat, kodeBayar,jumlah,status) values(?,?,?,?,?,?,?)`,
                [
                  helper.convertJsonDateToMySqlDate(param.berlakuDariTanggal),
                  helper.convertJsonDateToMySqlDate(param.berlakuSampaiTanggal),
                  param.idBank,
                  param.nomorSurat,
                  param.kodeBayar,
                  param.jumlah,
                  param.status
                ],
                (err, result) => {
                  if (err) {
                    throw new Error("Data Tidak Tersimpan");
                  }

                  if (result.insertId > 0) {
                    param.idSuratPembayaran = result.insertId;
                    param.nasabah.idSuratPembayaran = result.insertId;
                    const nas = param.nasabah;
                    connection.query(
                      `insert into nasabah (idSuratPembayaran,nama, pangkat,nomorNasabah, 
                        tanggalLahir,tanggalSKEP,tanggalPensiun,,alamat) values(?,?,?,?,?,?,?,?,?)`,
                      [
                        nas.idSuratPembayaran,
                        nas.nama,
                        nas.pangkat,
                        nas.nomorNasabah,
                        helper.convertJsonDateToMySqlDate(nas.tanggalLahir),
                        helper.convertJsonDateToMySqlDate(nas.tanggalSKEP),
                        helper.convertJsonDateToMySqlDate(nas.tanggalPensiun),
                        nas.kodeJiwa,
                        nas.alamat
                      ],
                      (err1, result1) => {
                        if (err1) {
                          throw new Error("Data Tidak Tersimpan");
                        }

                        if (result1.insertId > 0) {
                          param.nasabah.idNasabah = result1.insertId;
                        }
                      }
                    );

                    connection.commit();
                    return resolve(param);
                  }
                  throw new Error("Data Tidak Tersimpan");
                }
              );
            }
          });
        }
      } catch (e) {
        connection.rollback();
        console.log("RoollBack");
        return reject(e);
      }
    });
  });
};

db.update = param => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection, next) => {
      try {
        if (err) next(err);
        if (connection) {
          connection.beginTransaction(error => {
            if (error) throw new Error("error");
            else {
              connection.query(
                `update suratPembayaran set berlakuDariTanggal=?,berlakuSampaiTanggal=?,idBank=?,
                nomorSurat=?, kodeBayar=?,jumlah=?,status=? where idSuratPembayaran=?`,
                [
                  helper.convertJsonDateToMySqlDate(param.berlakuDariTanggal),
                  helper.convertJsonDateToMySqlDate(param.berlakuSampaiTanggal),
                  param.idBank,
                  param.nomorSurat,
                  param.kodeBayar,
                  param.jumlah,
                  param.status,
                  param.idSuratPembayaran
                ],
                (err, result) => {
                  if (err) {
                    return reject(err);
                  }

                  if (result) {
                    const nas = param.nasabah;
                    connection.query(
                      `update nasabah set nama=?, pangkat=?,nomorNasabah=?, 
                        tanggalLahir=?,tanggalSKEP=?,tanggalPensiun=?,kodeJiwa=?, alamat=? where idNasabah=?`,
                      [
                        nas.nama,
                        nas.pangkat,
                        nas.nomorNasabah,
                        helper.convertJsonDateToMySqlDate(nas.tanggalLahir),
                        helper.convertJsonDateToMySqlDate(nas.tanggalSKEP),
                        helper.convertJsonDateToMySqlDate(nas.tanggalPensiun),
                        nas.kodeJiwa,
                        nas.alamat,
                        nas.idNasabah
                      ],
                      (err1, result1) => {
                        if (err1) {
                          throw new Error("Data Tidak Tersimpan");
                        }

                        if (result1) {
                          connection.commit();
                          return resolve(param);
                        }
                        return reject("Data Tidak Tersimpan");
                      }
                    );
                  } else {
                    return reject("Data Tidak Tersimpan");
                  }
                }
              );
            }
          });
        }
      } catch (e) {
        connection.rollback();
        console.log("RoollBack");
        return reject(e);
      }
    });
  });
};
db.delete = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      "delete from suratPembayaran where idMitraBayar= ?",
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

module.exports = db;
