const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Ensure table exists (lightweight safeguard)
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carrito_servicios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        service_id VARCHAR(120) NOT NULL,
        service_name VARCHAR(255),
        precio VARCHAR(100),
        cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_usuario_servicio (id_usuario, service_id),
        CONSTRAINT fk_carrito_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.error('Error creando tabla carrito_servicios', err);
  }
})();

// GET /api/carrito - Obtener carrito del usuario
router.get('/', authenticateToken, async (req, res) => {
  const idUsuario = req.user?.id_usuario;
  if (!idUsuario) return res.status(401).json({ message: 'No autenticado' });

  try {
    const [items] = await pool.query(
      'SELECT id, service_id, service_name, precio, cantidad FROM carrito_servicios WHERE id_usuario = ? ORDER BY created_at DESC',
      [idUsuario]
    );
    return res.json({ items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener carrito' });
  }
});

// POST /api/carrito - Agregar servicio al carrito
router.post('/',
  authenticateToken,
  body('serviceId').isLength({ min: 1 }).withMessage('Servicio requerido'),
  body('serviceName').optional().isLength({ min: 1 }),
  body('precio').optional().isLength({ min: 1 }),
  body('cantidad').optional().isInt({ gt: 0 }).withMessage('Cantidad inválida'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { serviceId, serviceName = '', precio = 'Consultar', cantidad = 1 } = req.body;
    const idUsuario = req.user?.id_usuario;
    if (!idUsuario) return res.status(401).json({ message: 'No autenticado' });

    try {
      const [result] = await pool.query(
        `INSERT INTO carrito_servicios (id_usuario, service_id, service_name, precio, cantidad)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE cantidad = cantidad + ?, created_at = CURRENT_TIMESTAMP`,
        [idUsuario, serviceId, serviceName, precio, cantidad, cantidad]
      );
      return res.status(201).json({ message: 'Servicio agregado al carrito', serviceId, cantidad });
    } catch (err) {
      console.error('Error al agregar servicio al carrito:', err);
      return res.status(500).json({ message: 'Error al agregar al carrito: ' + err.message });
    }
  }
);

// PUT /api/carrito/:itemId - Actualizar cantidad
router.put('/:itemId',
  authenticateToken,
  body('cantidad').isInt({ gt: 0 }).withMessage('Cantidad inválida'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { itemId } = req.params;
    const { cantidad } = req.body;
    const idUsuario = req.user?.id_usuario;
    if (!idUsuario) return res.status(401).json({ message: 'No autenticado' });

    try {
      const [rows] = await pool.query(
        'SELECT id FROM carrito_servicios WHERE id = ? AND id_usuario = ?',
        [itemId, idUsuario]
      );
      if (!rows.length) return res.status(404).json({ message: 'Ítem no encontrado' });

      await pool.query(
        'UPDATE carrito_servicios SET cantidad = ? WHERE id = ? AND id_usuario = ?',
        [cantidad, itemId, idUsuario]
      );
      return res.json({ message: 'Cantidad actualizada' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al actualizar carrito' });
    }
  }
);

// DELETE /api/carrito/:itemId - Eliminar del carrito
router.delete('/:itemId', authenticateToken, async (req, res) => {
  const { itemId } = req.params;
  const idUsuario = req.user?.id_usuario;
  if (!idUsuario) return res.status(401).json({ message: 'No autenticado' });

  try {
    const result = await pool.query(
      'DELETE FROM carrito_servicios WHERE id = ? AND id_usuario = ?',
      [itemId, idUsuario]
    );
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Ítem no encontrado' });
    return res.json({ message: 'Ítem eliminado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
});

// Crear tabla para eventos en carrito si no existe
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carrito_eventos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        id_evento INT NOT NULL,
        titulo_evento VARCHAR(255),
        cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_usuario_evento (id_usuario, id_evento),
        CONSTRAINT fk_carrito_evt_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        CONSTRAINT fk_carrito_evt_evento FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.error('Error creando tabla carrito_eventos', err);
  }
})();

// GET /api/carrito/eventos - Obtener eventos en carrito
router.get('/eventos', authenticateToken, async (req, res) => {
  const idUsuario = req.user?.id_usuario;
  if (!idUsuario) return res.status(401).json({ message: 'No autenticado' });

  try {
    const [items] = await pool.query(
      `SELECT ce.id, ce.id_evento, ce.titulo_evento, ce.cantidad, ce.created_at,
              e.capacidad, e.aforo_actual
       FROM carrito_eventos ce
       LEFT JOIN eventos e ON ce.id_evento = e.id_evento
       WHERE ce.id_usuario = ? 
       ORDER BY ce.created_at DESC`,
      [idUsuario]
    );
    return res.json({ items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener eventos del carrito' });
  }
});

// POST /api/carrito/eventos - Agregar evento al carrito
router.post('/eventos',
  authenticateToken,
  body('id_evento').isInt({ gt: 0 }).withMessage('ID evento requerido'),
  body('cantidad').optional().isInt({ gt: 0 }).withMessage('Cantidad inválida'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id_evento, cantidad = 1 } = req.body;
    const idUsuario = req.user?.id_usuario;
    if (!idUsuario) return res.status(401).json({ message: 'No autenticado' });

    try {
      // Obtener datos del evento
      const [eventRows] = await pool.query(
        'SELECT titulo FROM eventos WHERE id_evento = ?',
        [id_evento]
      );
      if (!eventRows.length) return res.status(404).json({ message: 'Evento no encontrado' });

      const tituloEvento = eventRows[0].titulo;

      const [result] = await pool.query(
        `INSERT INTO carrito_eventos (id_usuario, id_evento, titulo_evento, cantidad)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE cantidad = cantidad + ?, created_at = CURRENT_TIMESTAMP`,
        [idUsuario, id_evento, tituloEvento, cantidad, cantidad]
      );
      return res.status(201).json({ message: 'Evento agregado al carrito', id_evento, cantidad });
    } catch (err) {
      console.error('Error al agregar evento al carrito:', err);
      return res.status(500).json({ message: 'Error al agregar evento al carrito: ' + err.message });
    }
  }
);

// PUT /api/carrito/eventos/:itemId - Actualizar cantidad de evento
router.put('/eventos/:itemId',
  authenticateToken,
  body('cantidad').isInt({ gt: 0 }).withMessage('Cantidad inválida'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { itemId } = req.params;
    const { cantidad } = req.body;
    const idUsuario = req.user?.id_usuario;
    if (!idUsuario) return res.status(401).json({ message: 'No autenticado' });

    try {
      const [rows] = await pool.query(
        'SELECT id FROM carrito_eventos WHERE id = ? AND id_usuario = ?',
        [itemId, idUsuario]
      );
      if (!rows.length) return res.status(404).json({ message: 'Ítem no encontrado' });

      await pool.query(
        'UPDATE carrito_eventos SET cantidad = ? WHERE id = ? AND id_usuario = ?',
        [cantidad, itemId, idUsuario]
      );
      return res.json({ message: 'Cantidad actualizada' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al actualizar carrito' });
    }
  }
);

// DELETE /api/carrito/eventos/:itemId - Eliminar evento del carrito
router.delete('/eventos/:itemId', authenticateToken, async (req, res) => {
  const { itemId } = req.params;
  const idUsuario = req.user?.id_usuario;
  if (!idUsuario) return res.status(401).json({ message: 'No autenticado' });

  try {
    const result = await pool.query(
      'DELETE FROM carrito_eventos WHERE id = ? AND id_usuario = ?',
      [itemId, idUsuario]
    );
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Ítem no encontrado' });
    return res.json({ message: 'Ítem eliminado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
});

module.exports = router;
