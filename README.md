InvSales System - Prueba Técnica

Sistema de Inventario, Ventas y Reportes desarrollado como parte de la prueba técnica de Playtech.

Incluye:

Backend: Spring Boot 3, PostgreSQL, JWT Security.

Frontend: React + Vite + TailwindCSS.

Autenticación y Roles: ADMIN y CASHIER.

🚀 Tecnologías utilizadas
Backend

Java 21

Spring Boot 3.5.6

Spring Data JPA

Spring Security + JWT

PostgreSQL

Maven

OpenPDF (para exportar reportes en PDF)

Frontend

React 18 + Vite

TailwindCSS

Axios (consumo de API REST)

📦 Módulos implementados

Inventario

CRUD de productos (crear, listar, actualizar, eliminar).

Validación de stock en cada venta.

Caja (Punto de venta)

Registro de ventas.

Generación de transactionNumber único.

Cálculo automático de totales.

Reportes

Reporte diario en JSON (endpoint REST).

Exportación a CSV.

Exportación a PDF.

Seguridad y Roles

Autenticación vía JWT.

Roles:

ADMIN → acceso completo a inventario, ventas, reportes y gestión de usuarios.

CASHIER → acceso a ventas y consulta de inventario.

Manejo de intentos de login y cierre de sesión.

⚙️ Instalación y configuración
1. Clonar el repositorio
git clone https://github.com/Elian1509/Laindia.git
cd Laindia

2. Configurar base de datos

Crear una base de datos en PostgreSQL:

# application.properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/LaindiaAlmuerzos
spring.datasource.username=postgres
spring.datasource.password=1927
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

3. Ejecutar backend
mvn spring-boot:run


La API estará disponible en: http://localhost:8080

4. Ejecutar frontend
cd frontend
npm install
npm run dev


El frontend estará en: http://localhost:5173

🔑 Autenticación (JWT)
Login
POST /api/auth/login


Body:

{
  "username": "admin",
  "password": "123456"
}


Respuesta:

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}


Usar en cada request:

Authorization: Bearer <token>

📌 Endpoints principales
Productos

POST /api/products → Crear producto.

GET /api/products → Listar todos.

PUT /api/products/{id} → Actualizar.

DELETE /api/products/{id} → Eliminar.

Ventas

POST /api/sales → Registrar venta.

Ejemplo body:

{
  "userId": 1,
  "items": [
    { "productId": 2, "quantity": 3 },
    { "productId": 5, "quantity": 1 }
  ]
}

Reportes

GET /api/reports/daily?date=2025-10-01 → JSON.

GET /api/reports/daily/csv?date=2025-10-01 → CSV.

GET /api/reports/daily/pdf?date=2025-10-01 → PDF.

📊 Ejemplo de reporte JSON
{
  "date": "2025-10-01",
  "totalSales": 2,
  "totalAmount": 95000,
  "items": [
    { "productName": "Coca Cola 1.5L", "quantity": 5, "total": 25000 },
    { "productName": "Arroz Diana 5kg", "quantity": 2, "total": 70000 }
  ]
}

🧑‍🤝‍🧑 Roles y permisos

ADMIN → inventario, ventas, reportes y gestión de usuarios.

CASHIER → ventas y consulta de inventario.

📝 Notas

DTOs para requests/responses.

Manejo de errores estandarizado (GlobalExceptionHandler).

Respuestas de error con formato RFC 9457.

Frontend en React + Tailwind con consumo de endpoints.

📌 Estado actual:
✔️ Backend completo
✔️ Frontend con login, dashboard, inventario, caja y reportes
⚡ Estilos básicos en TailwindCSS
