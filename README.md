# Backend de Videojuegos - Node.js (Express + TypeScript)

Este proyecto es el servicio backend (API REST) que gestiona los datos de los videojuegos y usuarios, utilizando Node.js, Express, y TypeScript. La persistencia de datos se maneja con MySQL, ejecutado a través de un contenedor Docker.

## Inicio Rápido

Sigue estos pasos para levantar tanto la base de datos como el servidor de la API en tu entorno local.

### 1\. Requisitos Previos

  * **Node.js y npm:** Se recomienda usar la versión LTS.
  * **Docker:** Necesario para levantar la base de datos MySQL.
  * **TypeScript y Nodemon:** Se utilizarán a través de los scripts de `npm`.

### 2\. Configuración de la Base de Datos (MySQL con Docker)

La aplicación requiere una instancia de MySQL con una base de datos específica. Usaremos Docker para esto.

**A. Crear y Ejecutar el Contenedor MySQL**

Ejecuta exactamente el mismo comando que usaste, el cual configura la contraseña de root y crea la base de datos:

```bash
docker run \
  --name webservice \
  -e MYSQL_ROOT_PASSWORD=12345 \
  -e MYSQL_DATABASE=proyecto_final \
  -p 3308:3306 \
  -d mysql:latest
```

| Parámetro | Valor | Descripción |
| :--- | :--- | :--- |
| `--name` | `webservice` | Nombre del contenedor. |
| `-e MYSQL_DATABASE` | `proyecto_final` | Nombre de la DB creada automáticamente. |
| `-e MYSQL_ROOT_PASSWORD` | `12345` | Contraseña de root (usada en la configuración del servidor Node.js). |
| `-p 3308:3306` | | Mapea el puerto local `3308` al puerto interno de Docker `3306`. |
| `-d` | `mysql:latest` | Ejecuta el contenedor en segundo plano. |

**B. Estructura de la Tabla de Usuarios (Referencia)**

Asegúrate de que la tabla `usuarios` exista y tenga la siguiente estructura (debe ser creada al inicio de la aplicación o manualmente si usas migraciones):

| Atributo | Tipo | Restricciones |
| :--- | :--- | :--- |
| `id` | `CHAR(36)` | PRIMARY KEY |
| `nombre` | `VARCHAR(100)` | NOT NULL |
| `apellidos` | `VARCHAR(100)` | NOT NULL |
| `email` | `VARCHAR(100)` | UNIQUE, NOT NULL |
| `password` | `VARCHAR(255)` | NOT NULL |
| `telefono` | `VARCHAR(15)` | |
| `fecha_registro` | `TIMESTAMP` | DEFAULT CURRENT\_TIMESTAMP |
| `fecha_ultima_sesion` | `TIMESTAMP` | NULL |
| `activo` | `BOOLEAN` | DEFAULT TRUE |

script:

    CREATE TABLE usuarios (
    -- Clave primaria, CHAR(36) para almacenar UUIDs

    id CHAR(36) PRIMARY KEY,
    
    -- Información personal
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    
    -- Seguridad
    password VARCHAR(255) NOT NULL,
    
    -- Contacto y Estado
    telefono VARCHAR(15),
    
    -- Fechas de control
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_sesion TIMESTAMP NULL,
    
    -- Estado de la cuenta
    activo BOOLEAN DEFAULT TRUE
    );

### 3\. Instalación de Dependencias

Navega al directorio raíz del proyecto de Node.js e instala todas las dependencias:

```bash
npm install
```

### 4\. Compilación y Ejecución del Servidor

Dado que el proyecto utiliza TypeScript, primero debe compilarse a JavaScript (generando la carpeta `dist/`). Luego, usaremos `nodemon` para ejecutar el archivo principal compilado.

#### Opción A: Desarrollo (Recomendado)

Si tu `package.json` tiene un script para `dev` que maneja la compilación y la ejecución con `nodemon` (por ejemplo, usando `ts-node` o `tsc -w` + `nodemon`):

```bash
# Generalmente este script compila y ejecuta con hot-reload
npm run dev
```

#### Opción B: Ejecución Directa (Si 'npm run dev' no existe o si prefieres el modo manual)

Si necesitas ejecutar la compilación y luego el servidor manualmente:

**Paso 4.1: Compilar TypeScript**

```bash
npm run build
```

*(Asumimos que este comando ejecuta `tsc` y genera los archivos `.js` en la carpeta `dist/`)*

**Paso 4.2: Ejecutar el Servidor con Nodemon**

Utiliza `nodemon` para monitorear el directorio `dist/` y reiniciar el servidor cuando se realicen cambios en el código JS compilado:

```bash
nodemon dist/server.js
```

*(Ajusta `server.js` si tu archivo de entrada se llama diferente, ej. `dist/app.js`)*

### 5\. Acceso a la API

Una vez que el servidor esté activo (generalmente en el puerto 3000 o 8080), podrás acceder a los endpoints de la API (por ejemplo, para testear con Postman o conectar el frontend de Angular).

**Ejemplo de acceso:**

```
http://localhost:3000/api/videojuegos
```
