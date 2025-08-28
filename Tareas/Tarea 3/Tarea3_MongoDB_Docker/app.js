require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Agenda = require('./models/Agenda');

const app = express();


const PORT = process.env.PORT || 5000;                
const PORT_PUBLIC = process.env.PORT_PUBLIC || PORT;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/agenda';

// Middlewares y vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Evitar 404 de favicon (opcional)
app.get('/favicon.ico', (_req, res) => res.sendStatus(204));

// Conexión Mongo con reintentos
(async () => {
  for (let i = 1; i <= 20; i++) {
    try {
      await mongoose.connect(MONGO_URL);
      console.log('✅ MongoDB conectado');
      break;
    } catch (err) {
      console.log(`⌛ Esperando Mongo (intento ${i}/20): ${err.message}`);
      await new Promise(r => setTimeout(r, 1500));
    }
  }
})();

// Rutas
app.get('/', async (req, res) => {
  const q = (req.query.nombres || '').trim();
  const filtro = q ? { nombres: { $regex: q, $options: 'i' } } : {};
  const users = await Agenda.find(filtro).sort({ createdAt: -1 });
  res.render('index', { users, nombres: q });
});

app.get('/users/new', (_req, res) => res.render('create'));

app.post('/users', async (req, res) => {
  try {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    await Agenda.create({ nombres, apellidos, fecha_nacimiento, direccion, celular, correo });
    res.redirect('/');
  } catch (e) {
    console.error(e);
    res.status(400).send('Error al crear: ' + e.message);
  }
});

app.get('/users/:id', async (req, res) => {
  const user = await Agenda.findById(req.params.id).catch(() => null);
  if (!user) return res.status(404).send('Contacto no encontrado');
  res.render('show', { user });
});

app.get('/users/:id/edit', async (req, res) => {
  const user = await Agenda.findById(req.params.id).catch(() => null);
  if (!user) return res.status(404).send('Contacto no encontrado');
  res.render('edit', { user });
});

app.put('/users/:id', async (req, res) => {
  try {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    await Agenda.findByIdAndUpdate(
      req.params.id,
      { nombres, apellidos, fecha_nacimiento, direccion, celular, correo },
      { runValidators: true }
    );
    res.redirect('/');
  } catch (e) {
    console.error(e);
    res.status(400).send('Error al actualizar: ' + e.message);
  }
});

app.delete('/users/:id', async (req, res) => {
  await Agenda.findByIdAndDelete(req.params.id).catch(() => null);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`🚀 Agenda en http://localhost:${PORT_PUBLIC}`);
});
