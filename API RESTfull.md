```markdown
# Documentación de la API RESTful

Última actualización: 2026-06-12

## Resumen

Esta documentación describe una API RESTful genérica usada en el proyecto TalentoTech-Nodejs (clase-11). Incluye detalles de autenticación, recursos, endpoints, ejemplos de peticiones y respuestas, manejo de errores y recomendaciones para pruebas.

> Nota: Adapte rutas, modelos y campos según la implementación real del servidor.

---

## Base URL

- Entorno local: http://localhost:3000/api
- Entorno producción: https://api.tuservidor.com/api

Reemplace según la configuración de su servidor.

---

## Autenticación

Se recomienda usar JWT (JSON Web Tokens) mediante el header Authorization.

- Header: Authorization: Bearer <token>
- Endpoints públicos: /auth/login, /auth/register (si aplica)

### Flujo típico

1. POST /auth/login { email, password } -> devuelve { token }
2. Incluir token en Authorization para endpoints protegidos.

---

## Recursos y Endpoints comunes

A continuación se describe la estructura CRUD del recurso `productos` para este proyecto. El endpoint individual acepta como identificador el `id` interno de Firestore o el `sku` de negocio, lo que permite URLs legibles sin perder la referencia técnica.

Rutas base: /productos

- GET /productos — Listar productos (con paginación y filtros)
- GET /productos/:id|:sku — Obtener un producto por id interno o por SKU
- POST /productos — Crear un nuevo producto
- PUT /productos/:id|:sku — Reemplazar un producto completo
- PATCH /productos/:id|:sku — Actualizar parcialmente un producto
- DELETE /productos/:id|:sku — Eliminar un producto

### Parámetros de consulta (GET /productos)

- page (number): número de página (ej. 1)
- limit (number): registros por página (ej. 10)
- sort (string): campo para ordenar, ej. name:asc
- q (string): término de búsqueda
- Otros filtros según modelo (price, stock, category, etc.)

### Ejemplos

- Listar (curl):

	curl -X GET "http://localhost:3000/api/productos?page=1&limit=10" -H "Authorization: Bearer <token>"

- Crear:

	curl -X POST "http://localhost:3000/api/productos" -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"name":"Producto nuevo","description":"Descripción","price":12.99,"stock":10,"sku":"PROD-10"}'

- Obtener por id o sku:

	curl -X GET "http://localhost:3000/api/productos/PROD-3" -H "Authorization: Bearer <token>"

---

## Modelos (ejemplo)

Modelo: Producto

- id: string (Firestore ID interno)
- sku: string (identificador de negocio legible, opcional en la URL)
- name: string (requerido)
- description: string (requerido)
- price: number (requerido)
- stock: number (requerido)
- createdAt: datetime
- updatedAt: datetime

Modelo: User (si aplica)

- id: string
- name: string
- email: string (único)
- password: string (almacenada hasheada)
- role: string (ej. admin, user)
- createdAt, updatedAt

---

## Códigos de estado y respuestas comunes

- 200 OK — Solicitud correcta (GET, PUT, PATCH)
- 201 Created — Recurso creado (POST)
- 204 No Content — Eliminación correcta (DELETE)
- 400 Bad Request — Validación fallida o datos inválidos
- 401 Unauthorized — Token ausente o inválido
- 403 Forbidden — Sin permisos suficientes
- 404 Not Found — Recurso no encontrado
- 409 Conflict — Conflicto (ej. correo ya existe)
- 500 Internal Server Error — Error inesperado del servidor

Ejemplo de error en JSON:

{
	"error": true,
	"message": "Descripción del error",
	"details": { "field": "mensaje" }
}

---

## Validación y manejo de errores

- Validar entrada con librerías como Joi, express-validator o Zod.
- Devolver mensajes claros y códigos HTTP apropiados.
- En este proyecto se usa un middleware de validación que verifica `name`, `price`, `stock`, `description` y `sku`.
- No incluir información sensible en mensajes de error (p. ej. stack traces) en producción.

---

## Seguridad

- Usar HTTPS en producción.
- Limitar intentos de login (rate limiting / bloqueo temporal).
- Hashear contraseñas con bcrypt o argon2.
- Validar y sanear entradas para prevenir inyección (NoSQL/SQL) y XSS.
- Configurar CORS con orígenes permitidos.

---

## Pruebas

- Usar Postman / Insomnia para probar endpoints.
- Escribir tests automáticos con Jest, Mocha, Supertest para endpoints.
- Cobertura mínima recomendada para rutas críticas: 80%.

---

## Ejemplos de implementaciones rápidas (pseudocódigo)

- Login (Node/Express):

	POST /auth/login
	- Validar email/password
	- Verificar usuario y contraseña
	- Generar JWT: jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '1h' })
	- Responder { token }

- Middleware de autenticación:

	- Extraer header Authorization
	- Verificar token
	- Añadir req.user con claims del token

---

## Versionado

- Versionar la API en la ruta: /api/v1/... para permitir cambios sin romper clientes.

---

## Consideraciones finales

- Documente cambios importantes en el changelog.
- Mantenga la documentación sincronizada con el código (Swagger/OpenAPI recomendado).
- Proporcione ejemplos de peticiones y respuestas reales para facilitar la integración.

---

## Consultas para Thunder Client

Recomendación: crear un entorno con variables:
- baseUrl = http://localhost:3000/api
- token = <JWT>

### 1) Autenticación

Login:
- Método: POST
- URL: {{baseUrl}}/auth/login
- Headers:
  - Content-Type: application/json
- Body (raw JSON):
  {
    "email": "test@example.com",
    "password": "password123"
  }

Register (si aplica):
- Método: POST
- URL: {{baseUrl}}/auth/register
- Headers:
  - Content-Type: application/json
- Body (raw JSON):
  {
    "name": "Usuario de prueba",
    "email": "test@example.com",
    "password": "password123"
  }

### 2) Listar recursos

- Método: GET
- URL: {{baseUrl}}/productos?page=1&limit=10
- Headers:
  - Authorization: Bearer {{token}}

### 3) Obtener recurso por id o SKU

- Método: GET
- URL: {{baseUrl}}/productos/{{id_o_sku}}
- Headers:
  - Authorization: Bearer {{token}}

### 4) Crear recurso

- Método: POST
- URL: {{baseUrl}}/productos
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{token}}
- Body (raw JSON):
  {
    "name": "Producto nuevo",
    "description": "Descripción de prueba",
    "price": 99.9,
    "stock": 50,
    "sku": "PROD-10"
  }

### 5) Reemplazar recurso completo

- Método: PUT
- URL: {{baseUrl}}/productos/{{id_o_sku}}
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{token}}
- Body (raw JSON):
  {
    "name": "Producto actualizado",
    "description": "Descripción completa actualizada",
    "price": 120.0,
    "stock": 80,
    "sku": "PROD-10"
  }

### 6) Actualizar recurso parcialmente

- Método: PATCH
- URL: {{baseUrl}}/productos/{{id_o_sku}}
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{token}}
- Body (raw JSON):
  {
    "description": "Cambio parcial de descripción"
  }

### 7) Eliminar recurso

- Método: DELETE
- URL: {{baseUrl}}/productos/{{id_o_sku}}
- Headers:
  - Authorization: Bearer {{token}}

### Ejemplo de flujo de prueba completo

1. Crear usuario / login.
2. Guardar token en la variable {{token}}.
3. Crear un producto.
4. Listar productos.
5. Obtener el producto creado con {{id_o_sku}}.
6. Actualizar con PATCH o PUT.
7. Eliminar el producto.

---
