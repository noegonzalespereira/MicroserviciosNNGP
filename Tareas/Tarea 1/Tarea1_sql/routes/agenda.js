// routes/agenda.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Mostrar todos los contactos
router.get('/', (req, res) => {
  db.query('SELECT * FROM agenda', (err, results) => {
    if (err) throw err;
    res.render('index', { contactos: results });
  });
});

// Mostrar formulario para agregar
router.get('/add', (req, res) => {
  res.render('add');
});

// Agregar contacto
router.post('/add', (req, res) => {
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  db.query(
    'INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES (?, ?, ?, ?, ?, ?)',
    [nombres, apellidos, fecha_nacimiento, direccion, celular, correo],
    err => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

// Mostrar formulario para editar
router.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM agenda WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    res.render('edit', { contacto: results[0] });
  });
});

// Actualizar contacto
router.post('/edit/:id', (req, res) => {
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  const id = req.params.id;
  db.query(
    'UPDATE agenda SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, direccion = ?, celular = ?, correo = ? WHERE id = ?',
    [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, id],
    err => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

// Eliminar contacto
router.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM agenda WHERE id = ?', [id], err => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;
