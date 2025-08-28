require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const Tarea = require('./models/Tarea');

const app = express();

// Middlewares y vistas
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// URL de Mongo: en Docker vendrá de .env; si no, usa el local
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/tareas';

// Conexión con reintentos (Mongo puede tardar en estar listo)
(async () => {
  for (let i = 1; i <= 20; i++) {
    try {
      await mongoose.connect(MONGO_URL);
      console.log('✅ MongoDB conectado');
      break;
    } catch (e) {
      console.log(`⌛ Esperando Mongo (intento ${i}/20): ${e.message}`);
      await new Promise(r => setTimeout(r, 1500));
    }
  }
})();

// Rutas HTML (con EJS)
app.get('/', async (req, res) => {
  const q = req.query.titulo?.trim();
  const filtro = q ? { titulo: { $regex: q, $options: 'i' } } : {};
  const tareas = await Tarea.find(filtro).sort({ fecha_creacion: -1 });
  res.render('index', { tareas });
});

app.get('/tareas/new', (_req, res) => {
  res.render('create');
});

app.post('/tareas', async (req, res) => {
  try {
    const { titulo, descripcion, estado, fecha_creacion } = req.body;
    await Tarea.create({
      titulo,
      descripcion,
      estado,
      ...(fecha_creacion ? { fecha_creacion } : {})
    });
    res.redirect('/');
  } catch (e) {
    console.error(e);
    res.status(400).send('Error al crear la tarea: ' + e.message);
  }
});

app.get('/tareas/:id', async (req, res) => {
  const tarea = await Tarea.findById(req.params.id).catch(() => null);
  if (!tarea) return res.status(404).send('Tarea no encontrada');
  res.render('show', { tarea });
});

app.get('/tareas/:id/edit', async (req, res) => {
  const tarea = await Tarea.findById(req.params.id).catch(() => null);
  if (!tarea) return res.status(404).send('Tarea no encontrada');
  res.render('edit', { tarea });
});

app.put('/tareas/:id', async (req, res) => {
  try {
    const { titulo, descripcion, estado, fecha_creacion } = req.body;
    await Tarea.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion, estado, fecha_creacion },
      { runValidators: true }
    );
    res.redirect('/');
  } catch (e) {
    console.error(e);
    res.status(400).send('Error al actualizar: ' + e.message);
  }
});

app.delete('/tareas/:id', async (req, res) => {
  await Tarea.findByIdAndDelete(req.params.id).catch(() => null);
  res.redirect('/');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Tareas (vistas EJS) en http://localhost:${PORT}`);
});
