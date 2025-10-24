const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  estado: {
    type: String,
    enum: ['pendiente', 'en_progreso', 'completado'],
    default: 'pendiente'
  },
  fecha_creacion: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Tarea', tareaSchema);
