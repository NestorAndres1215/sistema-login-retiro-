const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia con tu usuario
  password: '12345', // Cambia con tu contraseña
  database: 'banco'
});

module.exports = db;
