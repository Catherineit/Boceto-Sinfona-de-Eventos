-- Esquema principal (schema.sql) — contiene las mismas sentencias que la migración 001
-- Útil para importación rápida en entornos locales

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin','usuario') NOT NULL DEFAULT 'usuario',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla eventos
CREATE TABLE IF NOT EXISTS eventos (
  id_evento INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha DATETIME NOT NULL,
  capacidad INT NOT NULL CHECK (capacidad >= 0),
  aforo_actual INT NOT NULL DEFAULT 0,
  estado ENUM('borrador','publicado','cancelado') NOT NULL DEFAULT 'publicado',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla reservas
CREATE TABLE IF NOT EXISTS reservas (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_evento INT NOT NULL,
  fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('activa','cancelada','asistida','no_asistida') NOT NULL DEFAULT 'activa',
  UNIQUE KEY uk_usuario_evento (id_usuario, id_evento),
  CONSTRAINT fk_reserva_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_reserva_evento FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices
CREATE INDEX IF NOT EXISTS idx_evento_fecha ON eventos(fecha);
CREATE INDEX IF NOT EXISTS idx_reserva_usuario ON reservas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_reserva_evento ON reservas(id_evento);

-- Nota: Mantener la consistencia de `aforo_actual` desde la capa de aplicación
-- para manejar correctamente concurrencia; alternativamente usar bloqueos o
-- mecanismos optimistas/almacenados según la estrategia de despliegue.
