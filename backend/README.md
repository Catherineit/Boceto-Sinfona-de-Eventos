# Boceto - Backend (Node.js / Express)

Este es un scaffold mínimo para el backend del sistema de eventos y reservas.

Requisitos
- Node.js 18+
- MySQL 8+

Instalación

```powershell
cd C:\Users\cathe\OneDrive\Escritorio\Boceto\backend
npm install
```

Configurar variables de entorno
- Copia `.env.example` a `.env` y ajusta los valores (usuario/clave de MySQL, JWT secret).

Ejecutar

```powershell
# en desarrollo (auto-reload)
npm run dev

# en producción
npm start
```

Endpoints principales (resumen)
- POST `/api/auth/register` -> registro de usuario
- POST `/api/auth/login` -> login (devuelve JWT)
- GET `/api/eventos` -> listado de eventos
- POST `/api/reservas` -> crear reserva (requiere Authorization: Bearer <token>)

Notas
- La reserva se realiza en una transacción que valida y actualiza `aforo_actual`.
- Este scaffold es un punto de partida; agregar validación adicional, logging, manejo de errores y pruebas.

Acceso temporal a phpMyAdmin
--------------------------------
Si necesitas inspeccionar la base de datos desde tu máquina de desarrollo sin exponer phpMyAdmin permanentemente, usa el script helper incluido:

```powershell
cd C:\Users\cathe\OneDrive\Escritorio\Boceto
.\scripts\open-phpmyadmin.ps1
```

El script crea (si hace falta) la red Docker `appnet` y lanza un contenedor `phpmyadmin` temporal mapeando por defecto `localhost:8080` al servicio. El contenedor se elimina al detenerlo (flag `--rm`).

Opcionalmente puedes cambiar puerto o credenciales:

```powershell
.\scripts\open-phpmyadmin.ps1 -Port 8888 -PmaPassword "miPass"
```

Asegúrate de parar el contenedor cuando termines (CTRL+C) para no dejar phpMyAdmin expuesto.
