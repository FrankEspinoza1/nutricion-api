// Modelo de datos: define la estructura de un documento de la coleccion servicios
const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre:      { type: String, required: true, trim: true },
  descripcion: { type: String, default: '' },
  categoria:   { type: String, default: 'General' },
  precio:      { type: Number, required: true, min: 0 },
  duracion:    { type: Number, required: true, min: 5 }   // en minutos
}, { timestamps: true });

module.exports = mongoose.model('Servicio', servicioSchema);
