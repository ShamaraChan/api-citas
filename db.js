// db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;

///Reemplaza tu `db.js` con este. Ahora necesitas crear un archivo `.env` en la raíz de tu proyecto con los valores de Railway:

MYSQLHOST=mysql.railway.internal
MYSQLUSER=root
MYSQLPASSWORD=kfUNGHRsqGwZdfVviANVpBWWcBImpLja
MYSQLDATABASE=railway
MYSQLPORT=3306