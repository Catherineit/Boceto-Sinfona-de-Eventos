const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ? Number(process.env.JWT_EXPIRES_IN) : 900;
const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS ? Number(process.env.BCRYPT_ROUNDS) : 10;

// Register
router.post('/register',
  body('nombre').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('correo').isEmail().withMessage('Correo inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombre, correo, password } = req.body;
    try {
      const [rows] = await pool.query('SELECT id_usuario FROM usuarios WHERE correo = ?', [correo]);
      if (rows.length > 0) {
        console.log(`[REGISTER] Correo ya registrado: ${correo}`);
        return res.status(409).json({ message: 'Correo ya registrado' });
      }

      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, correo, password_hash) VALUES (?, ?, ?)',
        [nombre, correo, hash]
      );

      console.log(`[REGISTER] Registro exitoso para: ${correo} (ID: ${result.insertId})`);
      const user = { id_usuario: result.insertId, nombre, correo, rol: 'usuario' };
      res.status(201).json({ user });
    } catch (err) {
      console.error('[REGISTER] Error:', err);
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
);

// Login
router.post('/login',
  body('correo').isEmail().withMessage('Correo inválido'),
  body('password').exists().withMessage('Contraseña requerida'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { correo, password } = req.body;
    try {
      const [rows] = await pool.query('SELECT id_usuario, nombre, correo, password_hash, rol FROM usuarios WHERE correo = ?', [correo]);
      if (rows.length === 0) {
        console.log(`[LOGIN] Usuario no encontrado: ${correo}`);
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        console.log(`[LOGIN] Contraseña incorrecta para: ${correo}`);
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      console.log(`[LOGIN] Login exitoso para: ${correo}`);
      const payload = { id_usuario: user.id_usuario, correo: user.correo, rol: user.rol };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.json({ token, user: { id_usuario: user.id_usuario, nombre: user.nombre, correo: user.correo, rol: user.rol } });
    } catch (err) {
      console.error('[LOGIN] Error:', err);
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
);

module.exports = router;
