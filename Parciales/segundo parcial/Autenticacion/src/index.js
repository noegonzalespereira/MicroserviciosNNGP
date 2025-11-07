require("reflect-metadata");
require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { getConnection } = require("typeorm");
const connectDB = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || "dev-secret";
const EXPIRES = process.env.JWT_EXPIRES || "2h";


app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3003",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());


connectDB();


const repo = () => getConnection().getRepository("Usuario");
const normalizeEmail = (s="") => String(s).trim().toLowerCase();



// Registro 
app.post("/register", async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ error: "correo y password son requeridos" });
    }

    const email = normalizeEmail(correo);
    const exists = await repo().findOne({ where: { correo: email } });
    if (exists) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);
    const nuevo = repo().create({ correo: email, contraseña: hash });
    await repo().save(nuevo);

    return res.status(201).json({ message: "Usuario registrado", id: nuevo.id, correo: nuevo.correo });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// Login (devuelve JWT)
app.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ error: "correo y password son requeridos" });
    }

    const email = normalizeEmail(correo);
    const user = await repo().findOne({ where: { correo: email } });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.contraseña);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ sub: user.id, email: user.correo }, SECRET, { expiresIn: EXPIRES });
    return res.json({ token, user: { id: user.id, correo: user.correo } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// Ruta protegida de prueba
app.get("/me", (req, res) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Falta token" });

  try {
    const payload = jwt.verify(token, SECRET);
    return res.json({ ok: true, payload });
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
});

app.listen(PORT, () => {
  console.log(`escuchando en http://localhost:${PORT}`);
});
