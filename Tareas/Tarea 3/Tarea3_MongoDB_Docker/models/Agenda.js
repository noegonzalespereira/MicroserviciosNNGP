const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    fecha_nacimiento: { type: Date, required: true },
    direccion: { type: String, required: true },
    celular: { type: String, required: true },
    correo: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Agenda', agendaSchema);