const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Crear reserva: transacción segura que verifica cupo y actualiza aforo_actual
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;
  const { id_evento } = req.body;
  if (!id_evento) return res.status(400).json({ message: 'id_evento es requerido' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Verificar que exista el evento y que haya cupo
    const [evRows] = await conn.query('SELECT capacidad, aforo_actual, estado FROM eventos WHERE id_evento = ? FOR UPDATE', [id_evento]);
    if (evRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    const evento = evRows[0];
    if (evento.estado !== 'publicado') {
      await conn.rollback();
      return res.status(400).json({ message: 'Evento no está disponible para reservas' });
    }

    if (evento.aforo_actual >= evento.capacidad) {
      await conn.rollback();
      return res.status(400).json({ message: 'Cupo agotado' });
    }

    // Verificar que el usuario no tenga ya una reserva para el evento (unicidad)
    const [existing] = await conn.query('SELECT id_reserva FROM reservas WHERE id_usuario = ? AND id_evento = ?', [userId, id_evento]);
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(409).json({ message: 'Ya existe una reserva para este usuario y evento' });
    }

    // Insertar reserva
    const [ins] = await conn.query('INSERT INTO reservas (id_usuario, id_evento) VALUES (?, ?)', [userId, id_evento]);

    // Actualizar aforo_actual
    await conn.query('UPDATE eventos SET aforo_actual = aforo_actual + 1 WHERE id_evento = ?', [id_evento]);

    await conn.commit();
    res.status(201).json({ id_reserva: ins.insertId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  } finally {
    conn.release();
  }
});

// Listar reservas del usuario
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;
  try {
    const [rows] = await pool.query('SELECT r.id_reserva, r.id_evento, r.fecha_reserva, r.estado, e.titulo, e.fecha as fecha_evento FROM reservas r JOIN eventos e ON r.id_evento = e.id_evento WHERE r.id_usuario = ? ORDER BY r.fecha_reserva DESC', [userId]);
    res.json({ reservas: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Cancelar reserva (propietario puede cancelar) - ajusta aforo de forma transaccional
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;
  const id_reserva = req.params.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Bloquear la fila de reserva para evitar condiciones de carrera
    const [rows] = await conn.query('SELECT id_reserva, id_evento, id_usuario FROM reservas WHERE id_reserva = ? FOR UPDATE', [id_reserva]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const reserva = rows[0];
    if (reserva.id_usuario !== userId) {
      await conn.rollback();
      return res.status(403).json({ message: 'No autorizado para cancelar esta reserva' });
    }

    // Eliminar la reserva
    await conn.query('DELETE FROM reservas WHERE id_reserva = ?', [id_reserva]);

    // Decrementar aforo_actual de forma segura
    await conn.query('UPDATE eventos SET aforo_actual = GREATEST(0, aforo_actual - 1) WHERE id_evento = ?', [reserva.id_evento]);

    await conn.commit();
    res.json({ message: 'Reserva cancelada' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  } finally {
    conn.release();
  }
});

module.exports = router;
