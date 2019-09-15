const mysql = require("mysql");


const pool = mysql.createPool({
  connectionLimit: 10,
  password: "",
  database: "asabridb",
  user: "root"
}); 


module.exports = pool;
