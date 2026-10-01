// Punto de entrada del componente backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const conectarBD = require('./config/db');
const rutasServicios = require('./routes/servicios');

const app = express();
const PUERTO = process.env.PORT || 3000;

// Permite que el componente frontend, alojado en otro dominio,
// pueda consumir esta API
app.use(cors());
app.use(express.json());

app.use('/api/servicios', rutasServicios);

// Endpoint de salud: lo usa la prueba de integracion y el monitoreo
app.get('/api/estado', (req, res) => {
  res.json({
    estado: 'activo',
    componente: 'nutricion-api',
    baseDatos: 'MongoDB Atlas',
    fecha: new Date().toISOString()
  });
});

// Raiz informativa: este componente ya no sirve paginas HTML
app.get('/', (req, res) => {
  res.json({
    componente: 'nutricion-api',
    descripcion: 'API REST de Nutricion Sin Enredos',
    endpoints: ['/api/estado', '/api/servicios']
  });
});

conectarBD().then(() => {
  app.listen(PUERTO, () => console.log('Servidor escuchando en el puerto ' + PUERTO));
});
