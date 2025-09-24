require("dotenv").config();
const express = require("express");
const usuarioRoutes = require("./routes/usuarioRoutes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const { AppDataSource } = require('./database');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/usuarios", usuarioRoutes);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuarios",
      version: "1.0.0",
      description: "Documentación de la API de Usuarios con Node.js y TypeORM",
    },
    servers: [{ url: "http://localhost:3000", description: "Servidor Local" }],
  },
  apis: [path.join(__dirname, "routes/*.js")]
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/", (req, res) => {
  res.send("Bienvenido a la página principal!!");
});

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Conexión a la BD exitosa');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📄 Swagger en http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar con la base de datos:", error);
  });