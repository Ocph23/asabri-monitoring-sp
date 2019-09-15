var pool = require('./dbconnection')
var db ={};

db.get=()=>{
    return new Promise((resolve, reject) => {
        pool.query("select * from MitraBayar",
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
          "select * from MitraBayar where =?",[id],
          (err, result) => {
            if (err) {
              return reject(err);
            }
            return resolve(result);
          }
        );
      });
}

db.insert=(param)=>{
    return new Promise((resolve, reject) => {
        pool.query(
          "insert into MitraBayar (idBank, nama,alamat, kode,email) values(?,?,?,?,?)",
          [param.idBank, param.nama, param.alamat, param.kode,param.email],
          (err, result) => {
            if (err) {
              return reject(err);
            }
            if (result.insertId > 0) {
              param.idMitraBayar = result.insertId;
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
          "update mitraBayar set idBank=?, nama=?,alamat=?, kode=?,email=? where idMitraBayar=?",
          [param.idBank, param.nama, param.alamat, param.kode,param.email,param.idMitraBayar],
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
db.delete=(id)=>{
    return new Promise((resolve, reject) => {
        pool.query(
          "delete from mitraBayar where idMitraBayar= ?",[id],
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
