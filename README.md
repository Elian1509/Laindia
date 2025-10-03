# InvSales System - Prueba Tecnica

Sistema de Inventario, Ventas y Reportes desarrollado con **Spring Boot 3, PostgreSQL y JWT Security** como parte de la prueba tecnica.

---

## 🚀 Tecnologias utilizadas
- Java 21
- Spring Boot 3.5.6
- Spring Data JPA
- Spring Security + JWT
- PostgreSQL
- Maven
- OpenPDF (para exportar reportes en PDF)

---

## Modulos implementados
1. **Inventario**  
   - CRUD de productos (crear, listar, actualizar, eliminar).
   
2. **Caja**  
   - Registro de ventas.  
   - Validacion de stock.  
   - Generacion de `transactionNumber` unico.  
   - Calculo automatico de totales.  

3. **Reportes**  
   - Reporte diario en **JSON**.  
   - Exportacion a **CSV**.  
   - Exportacion a **PDF**.  

4. **Seguridad**  
   - Autenticacion con JWT.  
   - Roles: `ADMIN` y `CASHIER`.  
   - Acceso restringido segun permisos.  

---

## Instalacion y configuracion

### 1. Clonar el repositorio
git clone https://github.com/Elian1509/Laindia.git
cd Laindia

### 2. Configurar base de datos
Crea una base de datos en PostgreSQL: CREATE DATABASE Laindia;

Configura `application.properties`:
properties
spring.datasource.url=jdbc:postgresql://localhost:5432/invsales
spring.datasource.username=postgres
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true


### 3. Ejecutar aplicacion
mvn spring-boot:run


La app estara disponible en: http://localhost:8080

---

## Autenticacion (JWT)

### Login
POST /api/auth/login
Body:

```json
{
  "username": "admin",
  "password": "123456"
}
```
Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

Usa el token en cada request:

Authorization: Bearer <token>


---

## Endpoints principales

### Productos
- `POST /api/products` → Crear producto.  
- `GET /api/products` → Listar todos.  
- `GET /api/products/{id}` → Buscar por ID.  
- `PUT /api/products/{id}` → Actualizar.  
- `DELETE /api/products/{id}` → Eliminar.  

### Ventas
- `POST /api/sales` → Registrar venta.  

Ejemplo body:
```json
{
  "userId": 1,
  "items": [
    { "productId": 2, "quantity": 3 },
    { "productId": 5, "quantity": 1 }
  ]
}
```

### Reportes
- `GET /api/reports/daily?date=2025-10-01` → JSON.  
- `GET /api/reports/daily/csv?date=2025-10-01` → CSV.  
- `GET /api/reports/daily/pdf?date=2025-10-01` → PDF.  

---

## Script SQL inicial
Archivo `script.sql` (ejemplo):

```sql
INSERT INTO roles (id, name) VALUES (1, 'ADMIN'), (2, 'CASHIER');

INSERT INTO users (id, username, password, role_id, created_at)
VALUES
  (1, 'admin', '$2a$10$8dDgEjYv8yZwN7Mwk...', 1, NOW()),
  (2, 'cajero', '$2a$10$8dDgEjYv8yZwN7Mwk...', 2, NOW());

-- Productos iniciales
INSERT INTO products (sku, name, description, price, stock, created_at)
VALUES
  ('SKU-001', 'Coca Cola 1.5L', 'Bebida gaseosa', 5000, 100, NOW()),
  ('SKU-002', 'Arroz Diana 5kg', 'Bolsa de arroz', 45000, 50, NOW());
```

*(Las contraseñas deben ir encriptadas con BCrypt, en este ejemplo estan recortadas por simplicidad).*

---

## Ejemplo de reporte JSON
```json
{
  "date": "2025-10-01",
  "totalSales": 2,
  "totalAmount": 95000,
  "items": [
    { "productName": "Coca Cola 1.5L", "quantity": 5, "total": 25000 },
    { "productName": "Arroz Diana 5kg", "quantity": 2, "total": 70000 }
  ]
}
```

---

## Roles
- **ADMIN** → acceso a todos los modulos.  
- **CASHIER** → acceso solo a ventas y consulta de inventario.  

---

## Notas
- El proyecto incluye DTOs para requests/responses.  
- Manejo de errores estandarizado con `GlobalExceptionHandler`.  
- Reportes implementados bajo estandar **RFC 9457** para respuestas de error.  

---

# Estado actual
- Backend completo (productos, ventas, reportes, seguridad).  
- Pendiente: Frontend en React + Tailwind.  
