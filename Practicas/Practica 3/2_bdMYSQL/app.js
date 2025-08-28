require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const cfg = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'apppass',
  database: process.env.DB_NAME || 'usersdb',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
};

let pool;

async function connectWithRetry() {
  for (let i = 1; i <= 20; i++) {
    try {
      pool = await mysql.createPool(cfg);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);
      console.log('✅ DB lista');
      return;
    } catch (e) {
      console.log(`⌛ Esperando DB (intento ${i}/20): ${e.message}`);
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  console.error('❌ No se pudo conectar a la DB tras varios intentos'); 
  process.exit(1);
}
connectWithRetry();

app.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id DESC');
  res.render('index', { users: rows });
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.redirect('/');
  try {
    await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
  } catch (e) {
    console.error('Error al insertar:', e.message);
  }
  res.redirect('/');
});

app.post('/users/:id/delete', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isInteger(id)) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  }
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App en http://localhost:${PORT}`));
