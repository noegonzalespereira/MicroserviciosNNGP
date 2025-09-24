import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import bodyParser from "body-parser";
import path from "path";
import agendaRoutes from "./routes/agenda";

createConnection().then(() => {
  const app = express();
  const port = 3000;

  app.use(bodyParser.urlencoded({ extended: true }));
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.static("public"));

  app.use("/", agendaRoutes);

  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
});
