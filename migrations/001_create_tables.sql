-- Migración 001: Crear tablas principales para el sistema de eventos y reservas
-- Ejecutar dentro de una transacción en MySQL 8+

START TRANSACTION;

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
  estado ENUM('borrador','publicado','cancelado') NOT NULL DEFAULT 'publicado',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla servicios
CREATE TABLE IF NOT EXISTS servicios (
  id_servicio INT AUTO_INCREMENT PRIMARY KEY,
  service_id VARCHAR(100) NOT NULL UNIQUE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio VARCHAR(50),
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

-- Tabla carrito_servicios
CREATE TABLE IF NOT EXISTS carrito_servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  service_id VARCHAR(100) NOT NULL,
  service_name VARCHAR(255),
  precio VARCHAR(50),
  cantidad INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_usuario_servicio (id_usuario, service_id),
  CONSTRAINT fk_carrito_servicios_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla carrito_eventos
CREATE TABLE IF NOT EXISTS carrito_eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_evento INT NOT NULL,
  titulo_evento VARCHAR(255),
  cantidad INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_usuario_evento_carrito (id_usuario, id_evento),
  CONSTRAINT fk_carrito_eventos_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_carrito_eventos_evento FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla reserva_servicios
CREATE TABLE IF NOT EXISTS reserva_servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  service_id VARCHAR(100),
  service_name VARCHAR(255),
  precio DECIMAL(10, 2),
  cantidad INT DEFAULT 1,
  fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(50) DEFAULT 'pendiente',
  CONSTRAINT fk_reserva_servicios_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices
CREATE INDEX idx_evento_fecha ON eventos(fecha);
CREATE INDEX idx_reserva_usuario ON reservas(id_usuario);
CREATE INDEX idx_reserva_evento ON reservas(id_evento);
CREATE INDEX idx_carrito_servicios_usuario ON carrito_servicios(id_usuario);
CREATE INDEX idx_carrito_eventos_usuario ON carrito_eventos(id_usuario);

COMMIT;

-- Nota: Mantener la consistencia de `aforo_actual` desde la capa de aplicación
-- para manejar correctamente concurrencia; alternativamente usar bloqueos o
-- mecanismos optimistas/almacenados según la estrategia de despliegue.
