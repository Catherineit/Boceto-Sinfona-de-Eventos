const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Crear reserva: transacción segura que verifica cupo
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;
  const { id_evento, cantidad = 1, fechaReserva } = req.body;
  if (!id_evento) return res.status(400).json({ message: 'id_evento es requerido' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Verificar que exista el evento
    const [evRows] = await conn.query('SELECT capacidad, estado FROM eventos WHERE id_evento = ? FOR UPDATE', [id_evento]);
    if (evRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    const evento = evRows[0];
    if (evento.estado !== 'publicado') {
      await conn.rollback();
      return res.status(400).json({ message: 'Evento no está disponible para reservas' });
    }

    if (cantidad > evento.capacidad) {
      await conn.rollback();
      return res.status(400).json({ message: 'La cantidad solicitada excede la capacidad del evento' });
    }

    // Verificar que el usuario no tenga ya una reserva para el evento (unicidad)
    const [existing] = await conn.query('SELECT id_reserva FROM reservas WHERE id_usuario = ? AND id_evento = ?', [userId, id_evento]);
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(409).json({ message: 'Ya existe una reserva para este usuario y evento' });
    }

    // Insertar reserva (fecha_reserva se establece automáticamente como TIMESTAMP actual)
    const [ins] = await conn.query('INSERT INTO reservas (id_usuario, id_evento) VALUES (?, ?)', [userId, id_evento]);

    await conn.commit();
    res.status(201).json({ id_reserva: ins.insertId, message: 'Reserva creada exitosamente' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  } finally {
    conn.release();
  }
});

// Listar todas las reservas (solo admin)
router.get('/admin/all', authenticateToken, async (req, res) => {
  const userRole = req.user.rol;
  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' });
  }
  try {
    const [rows] = await pool.query(`
      SELECT r.id_reserva, r.id_evento, r.fecha_reserva, r.estado, r.cantidad,
             e.titulo, e.fecha as fecha_evento,
             u.id_usuario, u.nombre as nombre_usuario, u.correo
      FROM reservas r 
      JOIN eventos e ON r.id_evento = e.id_evento
      JOIN usuarios u ON r.id_usuario = u.id_usuario
      ORDER BY r.fecha_reserva DESC
    `);
    res.json({ reservas: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
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

// Crear reserva de servicios del carrito
router.post('/servicios', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;
  const { items } = req.body; // Array de {service_id, service_name, precio, cantidad}

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'items es requerido y debe ser un array no vacío' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Crear tabla reserva_servicios si no existe
    await conn.query(`
      CREATE TABLE IF NOT EXISTS reserva_servicios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        service_id VARCHAR(100),
        service_name VARCHAR(255),
        precio DECIMAL(10, 2),
        cantidad INT DEFAULT 1,
        fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado VARCHAR(50) DEFAULT 'pendiente',
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
      )
    `);

    // Insertar cada item de la reserva de servicios
    for (const item of items) {
      const { service_id, service_name, precio, cantidad } = item;
      await conn.query(
        'INSERT INTO reserva_servicios (id_usuario, service_id, service_name, precio, cantidad) VALUES (?, ?, ?, ?, ?)',
        [userId, service_id, service_name, precio, cantidad]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Reserva de servicios creada exitosamente' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  } finally {
    conn.release();
  }
});

// Actualizar reserva (solo admin) - estado, fecha_evento, cantidad
router.put('/admin/:id', authenticateToken, async (req, res) => {
  const userRole = req.user.rol;
  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' });
  }

  const id_reserva = req.params.id;
  const { estado, cantidad } = req.body;

  try {
    // Validar estado si se proporciona
    const validEstados = ['activa', 'cancelada', 'asistida', 'no_asistida'];
    if (estado && !validEstados.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido. Debe ser: activa, cancelada, asistida o no_asistida' });
    }

    // Construir query dinámicamente
    const updates = [];
    const values = [];
    
    if (estado) {
      updates.push('estado = ?');
      values.push(estado);
    }
    
    if (cantidad !== undefined) {
      updates.push('cantidad = ?');
      values.push(cantidad);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    values.push(id_reserva);
    const query = `UPDATE reservas SET ${updates.join(', ')} WHERE id_reserva = ?`;
    
    const [result] = await pool.query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva actualizada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Generar reporte de reservas (solo admin)
router.get('/admin/reporte', authenticateToken, async (req, res) => {
  const userRole = req.user.rol;
  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' });
  }

  try {
    // Estadísticas generales
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_reservas,
        SUM(CASE WHEN estado = 'activa' THEN 1 ELSE 0 END) as activas,
        SUM(CASE WHEN estado = 'cancelada' THEN 1 ELSE 0 END) as canceladas,
        SUM(CASE WHEN estado = 'asistida' THEN 1 ELSE 0 END) as asistidas,
        SUM(CASE WHEN estado = 'no_asistida' THEN 1 ELSE 0 END) as no_asistidas
      FROM reservas
    `);

    // Reservas por evento
    const [porEvento] = await pool.query(`
      SELECT 
        e.titulo,
        e.id_evento,
        COUNT(r.id_reserva) as total_reservas,
        SUM(CASE WHEN r.estado = 'activa' THEN 1 ELSE 0 END) as activas
      FROM eventos e
      LEFT JOIN reservas r ON e.id_evento = r.id_evento
      GROUP BY e.id_evento, e.titulo
      ORDER BY total_reservas DESC
    `);

    // Reservas por usuario
    const [porUsuario] = await pool.query(`
      SELECT 
        u.nombre,
        u.correo,
        COUNT(r.id_reserva) as total_reservas,
        SUM(CASE WHEN r.estado = 'activa' THEN 1 ELSE 0 END) as activas
      FROM usuarios u
      LEFT JOIN reservas r ON u.id_usuario = r.id_usuario
      WHERE u.rol = 'usuario'
      GROUP BY u.id_usuario, u.nombre, u.correo
      HAVING total_reservas > 0
      ORDER BY total_reservas DESC
    `);

    // Reservas recientes (últimos 30 días)
    const [recientes] = await pool.query(`
      SELECT 
        DATE(r.fecha_reserva) as fecha,
        COUNT(*) as cantidad
      FROM reservas r
      WHERE r.fecha_reserva >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(r.fecha_reserva)
      ORDER BY fecha DESC
    `);

    res.json({
      estadisticas: stats[0],
      porEvento,
      porUsuario,
      recientes,
      fecha_generacion: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
