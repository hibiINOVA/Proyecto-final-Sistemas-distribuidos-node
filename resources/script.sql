CREATE TABLE usuarios (
    id CHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(15),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_sesion TIMESTAMP NULL,
    activo BOOLEAN DEFAULT TRUE
);

INSERT INTO usuarios (
    id, nombre, apellidos, email, password, telefono,
    fecha_registro, fecha_ultima_sesion, activo
) VALUES
(
    '0b1f6c1f-0609-4778-93d9-0ee4462eb80f',
    'jose',
    'garcia morales',
    'conoplant2@gmail.com',
    '$2b$10$zHWujMFZUH3NyXFNZZsyduoPxvwu/s.4yDh9eRWYLfRioJwt4bYqq',
    '5551234567',
    '2025-12-09 02:28:30',
    '2025-12-09 07:25:44',
    1
),
(
    'd1be722a-f1f9-43de-9557-52d6975e3ced',
    'jose manuel',
    'garcia morales',
    'hibiynova@gmail.com',
    '$2b$10$R2YkCAUo16IyUQhzh9boP.in9AgpA2Ug/n9V0iXqg4GPaKfhzP0.u',
    '4151445758',
    '2025-12-11 02:55:52',
    '2025-12-11 02:57:27',
    1
);
