// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const agendaRoutes = require('./routes/agenda');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', agendaRoutes);

app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
