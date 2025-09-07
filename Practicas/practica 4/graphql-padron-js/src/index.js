require("reflect-metadata");
const { DataSource } = require("typeorm");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const Libro = require("./entity/Libro");
const Prestamo = require("./entity/Prestamo");
const Mesa = require("./entity/Mesa");
const Padron = require("./entity/Padron");


const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",    
  password: "12345",         
  database: "graphql_practica",
  synchronize: true,
  logging: false,
  entities: [Mesa, Padron,Libro, Prestamo],
});
module.exports.AppDataSource = AppDataSource;  // <-- clave para evitar 'undefined'


const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

async function startServer() {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  await AppDataSource.initialize();
  console.log("✅ Conectado a la base de datos");

  app.listen(4000, () => {
    console.log(`🚀 Servidor listo en http://localhost:4000${server.graphqlPath}`);
  });
}
startServer();
