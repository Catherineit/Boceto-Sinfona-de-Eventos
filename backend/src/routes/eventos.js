const express = require('express');
const router = express.Router();
const pool = require('../db');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Listar eventos con filtros simples
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_evento, titulo, descripcion, fecha, capacidad, aforo_actual, estado FROM eventos WHERE estado = "publicado" ORDER BY fecha ASC');
    res.json({ eventos: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Detalle evento
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM eventos WHERE id_evento = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json({ evento: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear evento (admin)
router.post('/', authenticateToken, requireRole('admin'),
  body('titulo').isLength({ min: 3 }),
  body('fecha').isISO8601(),
  body('capacidad').isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { titulo, descripcion, fecha, capacidad } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO eventos (titulo, descripcion, fecha, capacidad) VALUES (?, ?, ?, ?)',
        [titulo, descripcion || null, fecha, capacidad]
      );
      res.status(201).json({ id_evento: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
);

// Actualizar evento (admin)
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  const id = req.params.id;
  const { titulo, descripcion, fecha, capacidad, estado } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE eventos SET titulo = COALESCE(?, titulo), descripcion = COALESCE(?, descripcion), fecha = COALESCE(?, fecha), capacidad = COALESCE(?, capacidad), estado = COALESCE(?, estado) WHERE id_evento = ?',
      [titulo, descripcion, fecha, capacidad, estado, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json({ message: 'Evento actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar evento (admin)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM eventos WHERE id_evento = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json({ message: 'Evento eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
