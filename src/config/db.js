// Conexion con el servidor de base de datos (MongoDB Atlas)
const mongoose = require('mongoose');

async function conectarBD() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = conectarBD;
