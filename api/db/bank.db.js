var pool = require('./dbconnection')
var db ={};

db.get=()=>{
    return new Promise((resolve, reject) => {
        pool.query("select * from bank",
        (err, result) => {
            if (err) {
              return reject(err);
            }
            return resolve(result);
          }
        );
      });
};

db.getById=(id)=>{
    return new Promise((resolve, reject) => {
        pool.query(
          "select * from bank where idBank= ?",[id],
          (err, result) => {
            if (err) {
              return reject(err);
            }
            return resolve(result[0]);
          }
        );
      });
}

db.insert=(param)=>{
    return new Promise((resolve, reject) => {
        pool.query(
          "insert into bank (nama,kodeBank) values(?,?)",
          [param.nama, param.kodeBank],
          (err, result) => {
            if (err) {
              return reject(err);
            }
    
            if (result.insertId > 0) {
              param.idUser = result.insertId;
              return resolve(param);
            }
            return reject("Data Tidak Tersimpan");
          }
        );
      });
}

db.update=(param)=>{
    return new Promise((resolve, reject) => {
        pool.query(
          "update bank set nama=?,kodeBank=? where idBank=?",
          [param.nama, param.kodeBank,param.idBank],
          (err, result) => {
            if (err) {
              return reject(err);
            }
    
            if (result) {
              return resolve(result);
            }
            return reject("Data Tidak Tersimpan");
          }
        );
      });
}

db.delete=(id)=>{
    return new Promise((resolve, reject) => {
        pool.query(
          "delete from bank where idBank= ?",[id],
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
}

module.exports=db;
