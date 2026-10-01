// Rutas del CRUD de servicios
const express = require('express');
const Servicio = require('../models/Servicio');

const router = express.Router();

// LISTAR  ->  GET /api/servicios
router.get('/', async (req, res) => {
  try {
    const servicios = await Servicio.find().sort({ createdAt: -1 });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar los servicios' });
  }
});

// BUSCAR por nombre  ->  GET /api/servicios/buscar/:texto
router.get('/buscar/:texto', async (req, res) => {
  try {
    const servicios = await Servicio.find({
      nombre: { $regex: req.params.texto, $options: 'i' }
    });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en la busqueda' });
  }
});

// OBTENER uno  ->  GET /api/servicios/:id
router.get('/:id', async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    res.json(servicio);
  } catch (error) {
    res.status(400).json({ mensaje: 'Identificador invalido' });
  }
});

// CREAR  ->  POST /api/servicios
router.post('/', async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio, duracion } = req.body;
    if (!nombre || precio == null || duracion == null) {
      return res.status(400).json({ mensaje: 'Nombre, precio y duracion son obligatorios' });
    }
    const servicio = await Servicio.create({ nombre, categoria, descripcion, precio, duracion });
    res.status(201).json(servicio);
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo crear el servicio' });
  }
});

// ACTUALIZAR  ->  PUT /api/servicios/:id
router.put('/:id', async (req, res) => {
  try {
    const servicio = await Servicio.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!servicio) return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    res.json(servicio);
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo actualizar el servicio' });
  }
});

// ELIMINAR  ->  DELETE /api/servicios/:id
router.delete('/:id', async (req, res) => {
  try {
    const servicio = await Servicio.findByIdAndDelete(req.params.id);
    if (!servicio) return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    res.json({ mensaje: 'Servicio eliminado' });
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo eliminar el servicio' });
  }
});

module.exports = router;
