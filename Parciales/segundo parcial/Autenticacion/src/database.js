require("reflect-metadata");
require("dotenv").config();

const { createConnection } = require("typeorm");
const { Usuario } = require("../entity/Usuario"); 

const connectDB = async () => {
  try {
    await createConnection({
      type: "mysql",
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || "3310", 10),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: [Usuario],
      synchronize: true,   
      logging: false
    });
    console.log("Conexión MySQL OK");
  } catch (error) {
    console.error(" Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
