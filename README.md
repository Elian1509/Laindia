# InvSales System - Prueba Técnica Playtech

Sistema de **Inventario, Ventas y Reportes** desarrollado como entrega de la prueba técnica.
Backend con **Spring Boot + PostgreSQL + JWT** y frontend con **React + Vite + TailwindCSS**.

---

## 📌 Resumen

InvSales cubre:

* Gestión de productos (CRUD).
* Punto de venta (registro de ventas, validación de stock, `transactionNumber` único).
* Reportes diarios (JSON / CSV / PDF).
* Seguridad con JWT y roles (`ADMIN`, `CASHIER`).

---

## 🧰 Tecnologías principales

**Backend**

* Java 21
* Spring Boot 3.5.x
* Spring Data JPA
* Spring Security + JWT
* PostgreSQL
* Maven
* OpenPDF (PDF export)

**Frontend**

* React 18 (Vite)
* TailwindCSS (v3 compatible)
* Axios

---

## 📂 Estructura recomendada (resumen)


/ (repo)
 ├─ backend/ (Spring Boot app)
 ├─ frontend/ (React + Vite)
 │   ├─ public/
 │   │   └─ screenshots/   # capturas para README
 │   └─ src/
 ├─ README.md


---

## 🚀 Instalación y ejecución

### Requisitos previos

* Java 21 (JDK)
* Maven
* Node 18+ y npm
* PostgreSQL

### Clonar repositorio


git clone https://github.com/Elian1509/Laindia.git
cd Laindia


### Backend - Configurar DB

Editar `src/main/resources/application.properties` (o `application.yml`) con tu conexión PostgreSQL:

properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/LaindiaAlmuerzos
spring.datasource.username=postgres
spring.datasource.password=TU_PASSWORD
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect


> Preferible, crear la BD `LaindiaAlmuerzos` antes de arrancar.

### Backend - Ejecutar

Desde la carpeta raíz del backend:


mvn spring-boot:run


La API estará en `http://localhost:8080`.

---

### Frontend - Configuración y Tailwind (pasos recomendados)

Ir a la carpeta frontend:


cd frontend


1. Instalar dependencias:


npm install


2. **(Recomendado)** instalar Tailwind 3 explícitamente (para evitar problemas con v4):


npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@3.4.14 postcss autoprefixer


3. Si `npx tailwindcss init -p` falla, crea manualmente los archivos en la raíz de `frontend`:

`tailwind.config.js` (ESM para Vite):


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


`postcss.config.js` (si Vite marca error con ESM, usar CommonJS `module.exports`):


export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}


(o si da problemas):


module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}


4. Asegúrate que `src/index.css` contiene:

css
@tailwind base;
@tailwind components;
@tailwind utilities;


5. Importa `index.css` en la entrada (`src/main.jsx` o `src/index.jsx`):


import './index.css';


6. Ejecuta frontend:


npm run dev


Normalmente disponible en `http://localhost:5173`.

---

## 🔐 Autenticación (JWT)

### Login


POST /api/auth/login


Body ejemplo:

on
{ "username": "admin", "password": "123456" }


Respuesta:

on
{ "token": "eyJhbGciOi..." }


Usar header en requests:


Authorization: Bearer <token>


---

## 📡 Endpoints principales (resumen)

### Productos

* `POST /api/products` → Crear producto
* `GET /api/products` → Listar productos
* `GET /api/products/{id}` → Ver producto
* `PUT /api/products/{id}` → Actualizar
* `DELETE /api/products/{id}` → Eliminar

### Ventas

* `POST /api/sales` → Registrar venta
  Body ejemplo:

  on
  {
    "userId": 1,
    "items": [
      { "productId": 2, "quantity": 3 },
      { "productId": 5, "quantity": 1 }
    ]
  }
  

### Reportes

* `GET /api/reports/daily?date=YYYY-MM-DD` → JSON
* `GET /api/reports/daily/csv?date=YYYY-MM-DD` → CSV
* `GET /api/reports/daily/pdf?date=YYYY-MM-DD` → PDF

---

## 📊 Ejemplo de respuesta del reporte (JSON)

on
{
  "date": "2025-10-03",
  "totalSales": 5,
  "totalAmount": 41400.00,
  "items": [
    { "productName": "Pan Integral", "quantity": 1, "total": 4200.00 },
    { "productName": "Bananas", "quantity": 1, "total": 1800.00 }
  ]
}


> Nota: el frontend adapta ese JSON para mostrar la tabla / resumen. Si tu endpoint devuelve un shape distinto, el frontend puede transformar `items` → `productsSold` como se hizo en la app.

---

## 🛠️ Troubleshooting (problemas comunes)

### `npx tailwindcss init -p` falla / error `could not determine executable to run`

1. Borra `node_modules` y `package-lock.json` y reinstala:

   
   rm -rf node_modules package-lock.json
   npm install
   

   (Windows PowerShell: `rd /s /q node_modules` y `del package-lock.json`)

2. Forzar Tailwind v3:

   
   npm uninstall tailwindcss @tailwindcss/postcss
   npm install -D tailwindcss@3.4.14 postcss autoprefixer
   

3. Si sigue fallando, crea manualmente `tailwind.config.js` y `postcss.config.js` (ver sección Frontend).

### 403 para usuarios `CASHIER`

* Verifica que el JWT incluye el rol `CASHIER` y que tu `JwtAuthenticationFilter` construya la authority con prefijo `ROLE_` (p. ej. `ROLE_CASHIER`).
* Asegura el orden de reglas en `SecurityConfig` (poner las reglas más específicas — p. ej. `GET /api/products/**` — antes de reglas generales).

### Error `Cannot read properties of undefined (reading 'toFixed')` en frontend

* Significa que el backend devolvió `null`/`undefined` en algún número. Usar `Number(x || 0).toFixed(2)` o validar antes de renderizar.

---

## 🧪 Script para datos iniciales (opcional)

Puedes crear roles y un usuario admin por API (recomendado) o con SQL manual. Ejemplo SQL básico (ajusta nombres y contraseña según tu estrategia de encriptación):


-- crear roles (suponer tabla roles: id, name)
INSERT INTO roles (name) VALUES ('ADMIN'), ('CASHIER');

-- crear productos de ejemplo
INSERT INTO products (sku, name, description, price, stock) VALUES
('PAN-01', 'Pan Integral', 'Pan integral fresco', 4200, 10),
('BAN-01', 'Bananas', 'Bananas x kg', 1800, 20);


> Para crear el admin con contraseña hasheada usa el endpoint de creación de usuario del backend o genera el hash con BCrypt y pégalo en la DB.

---

## 🖼️ Capturas (agrega tus imágenes)

Coloca imágenes en `frontend/public/screenshots`:

* `login.png` (pantalla de inicio de sesión)
* `dashboard.png` (panel principal)
* `report.png` (vista de reportes)

Entonces el README mostrará las capturas.

---

## 📌 Estado actual

* Backend: completo (productos, ventas, reportes, seguridad).
* Frontend: funcional (login, dashboard, inventario, caja, reportes).
* Estilizado con Tailwind en progreso; ver sección troubleshooting si Tailwind no compila.

---

## 🤝 Contacto / notas finales

Si quieres que:

* Genere un script SQL más completo (usuarios + roles + productos).
* Suba las capturas de pantalla al repo.
* Ajuste el `README` con instrucciones para Dockerizar la app.

Dime cuál y lo agrego.

---

**Licencia:** MIT (opcional)
