const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Agenda = require('./models/Agenda');

const app = express();

// Configuración
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Para soportar PUT y DELETE
app.set('view engine', 'ejs');

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/agenda', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Rutas
app.get('/', async (req, res) => {
    const consulta = req.query.nombres;
    
    if (consulta) {
        const users = await Agenda.find({ nombres: consulta });
        return res.render('index', { users });
    }
    const users = await Agenda.find();
    res.render('index', { users });
});

// Crear nuevo
app.get('/users/new', (req, res) => {
    res.render('create');
});

app.post('/users', async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    await Agenda.create({ nombres, apellidos, fecha_nacimiento, direccion, celular, correo });
    res.redirect('/');
});

// Mostrar detalle
app.get('/users/:id', async (req, res) => {
    const user = await Agenda.findById(req.params.id);
    res.render('show', { user });
});

// Editar
app.get('/users/:id/edit', async (req, res) => {
    const user = await Agenda.findById(req.params.id);
    res.render('edit', { user });
});

app.put('/users/:id', async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    await Agenda.findByIdAndUpdate(req.params.id, { nombres, apellidos, fecha_nacimiento, direccion, celular, correo });
    res.redirect('/');
});

// Eliminar
app.delete('/users/:id', async (req, res) => {
    await Agenda.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});