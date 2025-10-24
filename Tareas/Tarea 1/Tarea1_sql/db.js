// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '12345', 
  database: 'bd_agenda'
});

connection.connect(err => {
  if (err) throw err;
  console.log('✅ Conectado a la base de datos');
});

module.exports = connection;
