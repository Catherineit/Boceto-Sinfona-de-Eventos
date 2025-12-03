# Boseto — Especificación Técnica (documentación web)

Página estática que contiene la especificación del sistema de reservas: requerimientos, arquitectura 4+1, diseño UX/UI, modelo de datos, seguridad, implementación y plan de pruebas.

Cómo abrirlo:

1. Abrir `index.html` en tu navegador (doble clic) o servirlo localmente.

Opcional: servir con un servidor estático (ej. Python)

Windows PowerShell:

```powershell
cd "C:\Users\cathe\OneDrive\Escritorio\Boseto"
python -m http.server 8000
# luego abrir http://localhost:8000
```

Archivos principales:

-   `index.html` — Página con la especificación completa.
-   `assets/styles.css` — Estilos personalizados.

Notas:

-   Bootstrap se carga desde CDN.
-   Esto es una página informativa estática; la implementación completa del sistema (React, Node.js, MySQL, migraciones, Docker) no está incluida aquí. Si quieres, puedo generar la estructura base de frontend/backend y las migraciones.

Acceso a phpMyAdmin en Docker
-----------------------------

Este repositorio incluye una configuración `docker-compose` que levanta MySQL, backend, frontend y `phpmyadmin` como servicio dentro de la red Docker `appnet`.

Por seguridad, `phpmyadmin` en `docker-compose.yml` está configurado sin mapeo de puerto hacia el host (no accesible públicamente). Aquí tienes las opciones para acceder cuando lo necesites:

- Opción 1 — Acceso temporal (recomendado para debugging): arranca un contenedor `phpmyadmin` one-off y móntalo en la red `appnet`, exponiendo temporalmente el puerto 8080 en el host. Cuando cierres el contenedor desaparece la exposición.

	PowerShell:

	```powershell
	# Ejecuta un contenedor temporario de phpMyAdmin en la red appnet
	docker run --rm -p 8080:80 --network appnet --env PMA_HOST=db --env PMA_USER=root --env PMA_PASSWORD=example phpmyadmin/phpmyadmin:latest
	# Abre http://localhost:8080 en tu navegador
	```

- Opción 2 — Acceso interno solo Docker (más seguro): deja `phpmyadmin` sin mapeo de puerto (como está ahora). Para inspeccionar la DB desde el host puedes ejecutar comandos SQL con `docker exec` o usar una herramienta cliente que se conecte al puerto 3306 del contenedor `db`.

	Ejemplo usando cliente `mysql` instalado en el host:

	```powershell
	# Conectar al MySQL expuesto por docker-compose (si tienes puerto mapeado 3306:3306)
	mysql -h 127.0.0.1 -P 3306 -u root -p
	```

- Opción 3 — Volver a mapear puertos permanentemente (no recomendado en entornos inseguros): editar `docker-compose.yml` y añadir `ports: - "8080:80"` en el servicio `phpmyadmin`, luego `docker-compose up -d --build`.

Notas de seguridad
- Evita exponer phpMyAdmin en entornos de producción sin capa adicional de autenticación y protección (VPN, firewall o acceso restringido por IP).
- Si cambias la contraseña de root en la sección `db` de `docker-compose.yml`, actualízala también en las variables de entorno de `phpmyadmin` si vas a usarlo.

Si quieres, puedo añadir un pequeño script PowerShell en `scripts/open-phpmyadmin.ps1` que ejecute la Opción 1 para mayor comodidad.
