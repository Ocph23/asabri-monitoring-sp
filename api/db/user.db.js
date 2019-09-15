const pool = require("./dbconnection");

const UserDb = {};

UserDb.login = user => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from users where userName=? or email=?",
      [user.userName, user.userName],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result[0]);
      }
    );
  });
};

UserDb.registerAdmin = user => {
  return new Promise((resolve, reject) => {
    pool.query(
      "insert into users (nama,userName,email,password,role) values(?,?,?,?,?)",
      [user.nama, user.userName, user.email, user.password, "admin"],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        if (result.insertId > 0) {
          user.idUser = result.insertId;
          return resolve(user);
        }

        return reject("Data Tidak Tersimpan");
      }
    );
  });
};

UserDb.registerMitraBayar = user => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection, next) => {
      try {
        if (err) next(err);
        if (connection) {
          connection.beginTransaction(error => {
            if (error) throw new Error("error");
            else {
              connection.query(
                "insert into users (nama,userName,email,password,role) values(?,?,?,?,?)",
                [user.nama, user.userName, user.email, user.password, "mitra"],
                (err, result) => {
                  if (err) {
                    throw new Error("Registrasi Gagal");
                  }
                  if (result) {
                    user.idUser = result.insertId;
                    connection.query(
                      "insert into UserMitraBayar (idUser,idMitraBayar,status) values (?,?,?)",
                      [user.idUser, user.idMitraBayar, true],
                      (err, result1) => {
                        if (err) {
                          throw new Error("Registrasi Gagal");
                        } else {
                          user.idUserMitraBayar = result1.insertId;
                          connection.commit();
                          return resolve(user);
                        }
                      }
                    );
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


UserDb.updateMitraUser=(id,param)=>{
  return new Promise((resolve, reject) => {
    try {
      pool.query(
        "update userMitraBayar set status=? where idUserMitraBayar=?",
        [param.status,id],
        (err, result) => {
          if (err) {
            throw new Error(err.message);
          }
          return resolve(param);
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
}

UserDb.getMitraBayarUser = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT
      users.nama, users.role, users.email as userEmail, usermitrabayar.status,
      mitrabayar.nama, mitrabayar.kode as kodeMitra, mitrabayar.email as mitraBayarEmail, bank.nama as namaBank,
      bank.kodeBank
    FROM
      usermitrabayar RIGHT JOIN
      users ON users.iduser = usermitrabayar.idUser LEFT JOIN
      mitrabayar ON usermitrabayar.idMitraBayar = mitrabayar.idMitraBayar
      LEFT JOIN
      bank ON mitrabayar.idBank = bank.idBank where users.iduser=?`,
      [id],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result[0]);
      }
    );
  });
};

module.exports = UserDb;
