const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  password: "",
  database: "dbbengkel",
  user: "root"
});

var dbContext = {};

dbContext.getAll = () => {
  return new Promise((resolve, reject) => {
    pool.query("select * from barang", (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });
};

module.exports = dbContext;
