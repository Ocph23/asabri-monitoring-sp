const pool = require("./dbconnection");

const model = {};
                                                                                                                                                                                                                             
model.login = user => {
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

model.registerAdmin = user => {
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
          return resolve(result);
        }

        return reject("Data Tidak Tersimpan");
      }
    );
  });
};

model.registerMitraBayar = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();
      connection.query(
        "insert into users (nama,userName,password,role) values ?",
        [user.nama, user.userName, user.password, "mitra"],
        (err, result) => {
          if (err) {
            throw new Error("Registrasi Gagal");
          } else {
            user.idUser = result.insertId;
          }
        }
      );

      connection.query(
        "insert into UserMitraBayar (nama,userName,password,role) values ?",
        [user.nama, user.userName, user.password, "mitra"],
        (err, result) => {
          if (err) {
            throw new Error("Registrasi Gagal");
          } else {
            user.idUser = result.insertId;
          }
        }
      );

      connection.commit();
      return resolve(user);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = model;
