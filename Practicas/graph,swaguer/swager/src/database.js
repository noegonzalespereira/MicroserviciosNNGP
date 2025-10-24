require('dotenv').config();
const { DataSource } = require('typeorm');
const { Usuario } = require('./entity/Usuario');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, // Solo para desarrollo
  entities: [Usuario],
});

module.exports = { AppDataSource };