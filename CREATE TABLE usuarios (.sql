CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin','usuario') NOT NULL DEFAULT 'usuario',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventos (
  id_evento INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha DATETIME NOT NULL,
  capacidad INT NOT NULL CHECK (capacidad >= 0),
  estado ENUM('borrador','publicado','cancelado') NOT NULL DEFAULT 'publicado',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservas (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_evento INT NOT NULL,
  fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('activa','cancelada','asistida','no_asistida') NOT NULL DEFAULT 'activa',
  UNIQUE KEY uk_usuario_evento (id_usuario, id_evento),
  CONSTRAINT fk_reserva_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_reserva_evento FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE
);

-- Índices útiles
CREATE INDEX idx_evento_fecha ON eventos(fecha);
CREATE INDEX idx_reserva_usuario ON reservas(id_usuario);
CREATE INDEX idx_reserva_evento ON reservas(id_evento);