<#
.SYNOPSIS
Lanza un contenedor temporal de phpMyAdmin unido a la red Docker `appnet`.

.DESCRIPTION
Este script ejecuta un contenedor de phpMyAdmin en la red `appnet` del docker-compose
para permitir acceso temporal desde el host en http://localhost:<Port>. El contenedor
se elimina automáticamente al detenerlo (flag --rm).

.PARAMETER Port
Puerto local que se mapeará al puerto 80 del contenedor (por defecto 8080).

.PARAMETER PmaHost
Host que phpMyAdmin usará para conectar a MySQL dentro de Docker (por defecto 'db').

.PARAMETER PmaUser
Usuario por defecto para phpMyAdmin (por defecto 'root').

.PARAMETER PmaPassword
Contraseña de root para MySQL (por defecto 'example').

.EXAMPLE
# Ejecuta phpMyAdmin temporal en el puerto 8080
.\scripts\open-phpmyadmin.ps1

.EXAMPLE
# Ejecuta en puerto 8888 y con otra contraseña
.\scripts\open-phpmyadmin.ps1 -Port 8888 -PmaPassword "miPass"
# Luego abrir http://localhost:8888
#
# Nota: requiere Docker y que exista la red 'appnet' creada por docker-compose.
# Si no existe la red, puedes crearla con: docker network create appnet
#
# Para detener el contenedor presiona Ctrl+C.
#>

param(
    [int]$Port = 8080,
    [string]$PmaHost = 'db',
    [string]$PmaUser = 'root',
    [string]$PmaPassword = 'example'
)

Write-Host "Iniciando phpMyAdmin temporal en http://localhost:$Port (Ctrl+C para detener)" -ForegroundColor Cyan

# Comprueba si la red 'appnet' existe
$networkExists = docker network ls --format "{{.Name}}" | Select-String -Pattern "^appnet$"
if (-not $networkExists) {
    Write-Host "La red 'appnet' no existe. Creando red 'appnet'..." -ForegroundColor Yellow
    docker network create appnet | Out-Null
}

$cmd = "docker run --rm -p $Port:80 --network appnet --env PMA_HOST=$PmaHost --env PMA_USER=$PmaUser --env PMA_PASSWORD=$PmaPassword phpmyadmin/phpmyadmin:latest"
Write-Host $cmd -ForegroundColor Green

Invoke-Expression $cmd
