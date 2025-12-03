# Boceto - Frontend (React + Vite + Bootstrap)

Scaffold mínimo del frontend. En producción el build usa la variable de build `VITE_API_BASE` para definir la URL base del API.

Por defecto el entorno de desarrollo usa `http://localhost:4000/api` si no se define `VITE_API_BASE`.

Instalación y arranque (PowerShell):

```powershell
cd C:\Users\cathe\OneDrive\Escritorio\Boceto\frontend
npm install
npm run dev
```

Rutas principales:
- `/` → Home / listado de eventos
- `/login` → Login
- `/eventos/:id` → Detalle de evento y reserva
- `/mis-reservas` → Reservas del usuario
- `/admin` → Panel admin (placeholder)

Build-time variable: Cuando se construye el contenedor se puede pasar `VITE_API_BASE` como argumento de build.

Ejemplo (docker-compose ya pasa `VITE_API_BASE` apuntando al servicio `backend`):

```powershell
docker-compose build frontend
docker-compose up -d frontend
```

Si prefieres no usar proxy en nginx, asegúrate de construir el frontend con `VITE_API_BASE` apuntando a la URL de la API accesible desde el navegador (ej. `https://api.misitio.com/api`).

Acceso temporal a phpMyAdmin
--------------------------------
Para inspeccionar la base de datos local sin exponer phpMyAdmin permanentemente, hay un script helper en `scripts/open-phpmyadmin.ps1` que lanza un contenedor temporal unido a la red `appnet`.

Ejemplo (PowerShell):

```powershell
cd C:\Users\cathe\OneDrive\Escritorio\Boceto
.\scripts\open-phpmyadmin.ps1
```

Puedes pasar `-Port` o credenciales si lo deseas, por ejemplo:

```powershell
.\scripts\open-phpmyadmin.ps1 -Port 8888 -PmaPassword "miPass"
```

El contenedor se elimina automáticamente al cerrarlo (CTRL+C). Requiere Docker y la red `appnet` (el script la crea si no existe).
