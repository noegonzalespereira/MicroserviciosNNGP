const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const agendaRoutes = require('./routes/agenda');
app.use('/', agendaRoutes);

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});