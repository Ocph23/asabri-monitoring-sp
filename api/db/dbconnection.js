const mysql = require("mysql");


// //online
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host:'den1.mysql1.gear.host',
//   password: "Sony@7777",
//   database: "asabridb",
//   user: "asabridb"
// }); 

//local
const pool = mysql.createPool({
  connectionLimit: 10,
 // host:'den1.mysql1.gear.host',
  password: "",
  database: "asabridb",
  user: "root"
}); 



module.exports = pool;
