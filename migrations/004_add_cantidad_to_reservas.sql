-- Migración 004: Agregar columna cantidad a reservas
-- Permite especificar número de personas en una reserva

ALTER TABLE reservas ADD COLUMN IF NOT EXISTS cantidad INT NOT NULL DEFAULT 1;
