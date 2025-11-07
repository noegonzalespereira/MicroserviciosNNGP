const { Schema, model } = require('mongoose');

const VehiculoSchema = new Schema({
  placa: { type: String, required: true, unique: true, trim: true },
  tipo: { type: String, enum: ['camion', 'furgon', 'moto'], required: true },
  capacidad: { type: Number, required: true, min: 0 }, 
  estado: { type: String, enum: ['disponible', 'en_ruta', 'mantenimiento'], default: 'disponible' }
}, { timestamps: true });

module.exports = model('Vehiculo', VehiculoSchema);
