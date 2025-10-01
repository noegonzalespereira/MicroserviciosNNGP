const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Trabajador = require('./models/Trabajador');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); 
app.set('view engine', 'ejs');

const port = process.env.PORT || 5000; 
const dbUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/trabajadores'; 

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(' Conectado a MongoDB'))
  .catch((err) => console.error(' Error de conexión:', err));

app.get('/trabajador', async (req, res) => {
  try {
    const consulta = req.query.nombre;
    let trabajadores;
    if (consulta) {
      trabajadores = await Trabajador.find({ nombre: consulta });
    } else {
      trabajadores = await Trabajador.find();
    }
    res.render('index', { trabajadores });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener trabajadores', error: error.message });
  }
});

app.get('/trabajador/new', (req, res) => {
  res.render('create');
});

app.post('/trabajador', async (req, res) => {
  const { nombre, apellido, cedula_identidad, cargo, departamento, fecha_ingreso } = req.body;
  try {
    const nuevoTrabajador = new Trabajador({
      nombre,
      apellido,
      cedula_identidad,
      cargo,
      departamento,
      fecha_ingreso
    });
    await nuevoTrabajador.save();
    res.redirect('/trabajador');
  } catch (error) {
    res.status(400).json({ message: 'Error al crear trabajador', error: error.message });
  }
});

app.get('/trabajador/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const trabajador = await Trabajador.findById(id);
    if (!trabajador) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }
    res.render('show', { trabajador });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener trabajador', error: error.message });
  }
});

app.get('/trabajador/:id/edit', async (req, res) => {
  const { id } = req.params;
  try {
    const trabajador = await Trabajador.findById(id);
    if (!trabajador) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }
    res.render('edit', { trabajador });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener trabajador', error: error.message });
  }
});

app.put('/trabajador/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, cedula_identidad, cargo, departamento, fecha_ingreso } = req.body;
  try {
    const trabajadorActualizado = await Trabajador.findByIdAndUpdate(id, {
      nombre,
      apellido,
      cedula_identidad,
      cargo,
      departamento,
      fecha_ingreso
    }, { new: true });

    if (!trabajadorActualizado) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }

    res.redirect('/trabajador');
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar trabajador', error: error.message });
  }
});

app.delete('/trabajador/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const trabajadorEliminado = await Trabajador.findByIdAndDelete(id);
    if (!trabajadorEliminado) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }
    res.redirect('/trabajador');
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar trabajador', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
