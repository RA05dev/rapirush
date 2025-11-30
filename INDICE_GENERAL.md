# 🗺️ ÍNDICE GENERAL DEL PROYECTO RAPIRUSH

**Guía de Navegación y Estructura del Proyecto**

---

## 📑 TABLA DE CONTENIDOS

1. [Visión General](#visión-general)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Funcionalidades Principales](#funcionalidades-principales)
4. [Guía de Uso - Cliente](#guía-de-uso---cliente)
5. [Guía de Uso - Restaurante](#guía-de-uso---restaurante)
6. [Guía de Uso - Repartidor](#guía-de-uso---repartidor)
7. [Referencia Técnica](#referencia-técnica)
8. [Solución de Problemas](#solución-de-problemas)

---

## 👁️ VISIÓN GENERAL

**RapiRush** es una plataforma de delivery de alimentos que conecta:
- **Clientes** 👥 que ordenan comida
- **Restaurantes** 🍔 que la preparan
- **Repartidores** 🚴 que la entregan

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | HTML5, Bootstrap 5.3, JavaScript (Vanilla) |
| **Backend** | Node.js, Express.js |
| **Base de Datos** | Supabase (PostgreSQL) |
| **Autenticación** | Supabase Auth |
| **Hospedaje (Datos)** | Supabase Cloud |

### Datos Actuales en BD

| Entidad | Cantidad | Estado |
|---------|----------|--------|
| Restaurantes | 15 | ✅ Activos |
| Productos | 55 | ✅ Con imágenes |
| Tamaños | 120+ | ✅ Con precios |
| Usuarios | Variable | ✅ Registrables |

---

## 📁 ESTRUCTURA DE CARPETAS

```
RapiRush/
│
├── 📄 AVANCE.md                    ← LEER PRIMERO (progreso actual)
├── 📄 INDICE_GENERAL.md            ← ESTE ARCHIVO
├── 📄 README.md                    ← Descripción general
│
├── 📂 Client/                      ← FRONTEND (interfaz usuario)
│   ├── 📄 index.html               ← Página inicio
│   ├── 📄 restaurantes.html        ← Listado restaurantes
│   ├── 📄 restaurante.html         ← Detalle restaurante
│   ├── 📄 carrito.html             ← Carrito de compras
│   ├── 📄 checkout.html            ← Página de pago
│   ├── 📄 agregarestaurante.html   ← Registro restaurante
│   ├── 📄 serepartidor.html        ← Registro repartidor
│   │
│   ├── 📂 auth/
│   │   ├── 📄 login.html           ← Login para todos
│   │   └── 📄 register.html        ← Registro cliente
│   │
│   ├── 📂 dashboard/
│   │   ├── 📄 cliente.html         ← Dashboard cliente
│   │   ├── 📄 restaurante.html     ← Dashboard restaurante
│   │   ├── 📄 repartidor.html      ← Dashboard repartidor
│   │   └── 📄 admin.html           ← Panel administración
│   │
│   ├── 📂 assets/
│   │   ├── 📂 css/
│   │   │   ├── 📄 styles.css       ← Estilos principales
│   │   │   └── 📄 admin.css        ← Estilos admin
│   │   ├── 📂 js/
│   │   │   ├── 📄 index.js         ← Lógica página inicio
│   │   │   ├── 📄 login.js         ← Lógica login
│   │   │   ├── 📄 register.js      ← Lógica registro
│   │   │   ├── 📄 cliente.js       ← Lógica dashboard cliente
│   │   │   ├── 📄 carrito.js       ← Lógica carrito
│   │   │   ├── 📄 checkout.js      ← Lógica checkout
│   │   │   ├── 📄 restaurantes.js  ← Lógica listado restaurantes
│   │   │   ├── 📄 authManager.js   ← Gestor autenticación ⭐
│   │   │   ├── 📄 main.js          ← Inicialización global
│   │   │   │
│   │   │   ├── 📂 api/
│   │   │   │   ├── 📄 rapiRushAPI.js     ← Wrapper API ⭐
│   │   │   │   └── 📄 cache.js           ← Sistema de caché
│   │   │   │
│   │   │   └── 📂 data/
│   │   │       └── 📄 restaurantData.js  ← Datos restaurantes
│   │   │
│   │   ├── 📂 icons/               ← Iconos personalizados
│   │   └── 📂 Img/                 ← Imágenes estáticas
│   │
│   └── 📂 data/
│       └── 📄 restaurantData.js    ← BD datos restaurantes
│
├── 📂 server/                      ← BACKEND (API)
│   ├── 📄 index.js                 ← Servidor principal ⭐
│   ├── 📄 package.json             ← Dependencias Node
│   │
│   └── 📂 src/
│       ├── 📂 config/
│       │   └── 📄 supabaseClient.js ← Configuración Supabase
│       │
│       ├── 📂 controllers/          ← Lógica de negocio
│       │   ├── 📄 authController.js      ← Auth (registro, login)
│       │   ├── 📄 orderController.js     ← Órdenes
│       │   ├── 📄 productController.js   ← Productos
│       │   ├── 📄 restaurantController.js ← Restaurantes
│       │   └── 📄 adminController.js     ← Funciones admin
│       │
│       ├── 📂 routes/
│       │   ├── 📄 authRoutes.js     ← Rutas autenticación
│       │   ├── 📄 orderRoutes.js    ← Rutas órdenes
│       │   ├── 📄 productRoutes.js  ← Rutas productos
│       │   └── 📄 restaurantRoutes.js ← Rutas restaurantes
│       │
│       ├── 📂 middleware/
│       │   └── 📄 authMiddleware.js ← Validación tokens
│       │
│       └── 📂 utils/
│           └── 📄 approvalScheduler.js ← Tareas automáticas
│
├── 📂 DataBase/                    ← SCRIPTS SQL
│   ├── 📄 nueva_bd.sql             ← Creación tablas
│   ├── 📄 nuevoproductos.sql       ← Datos productos
│   ├── 📄 nuevorestaurantes.sql    ← Datos restaurantes
│   ├── 📄 Productos-Sizes.js       ← Datos de origen
│   │
│   └── 📚 ARCHIVOS OBSOLETOS (a eliminar)
│       ├── Estado Final Proyecto...
│       ├── Guía de Ejecución SQL...
│       ├── etc.
│
└── 📂 Documentación/ (Archivos .md explicativos)
    └── [Ver lista abajo]
```

---

## ⚙️ FUNCIONALIDADES PRINCIPALES

### Para CLIENTES 👥

| Función | Archivo | Estado |
|---------|---------|--------|
| Registrarse | `register.html` + `register.js` | ✅ Nombre + Apellido |
| Iniciar sesión | `login.html` + `login.js` | ✅ Completo |
| Ver restaurantes | `restaurantes.html` + `restaurantes.js` | ✅ Completo |
| Ver menú restaurante | `restaurante.html` | ✅ Completo |
| Agregar al carrito | `carrito.html` + `carrito.js` | ✅ Completo |
| Realizar compra | `checkout.html` + `checkout.js` | ✅ Completo |
| Ver mis pedidos | `dashboard/cliente.html` + `cliente.js` | ✅ Completo |
| Editar perfil | Modal en dashboard | 🔨 En desarrollo |
| Favoritos | Dashboard | 🔨 En desarrollo |
| Calificaciones | Sistema | 🔨 En desarrollo |

### Para RESTAURANTES 🍔

| Función | Archivo | Estado |
|---------|---------|--------|
| Registrarse | `agregarestaurante.html` | ✅ Completo |
| Crear productos | `dashboard/restaurante.html` | 🔨 En desarrollo |
| Ver órdenes | Dashboard | 🔨 En desarrollo |
| Marcar como preparado | Dashboard | 🔨 En desarrollo |
| Reportes de ventas | Dashboard | 🔨 En desarrollo |
| Gestionar horarios | Dashboard | 🔨 En desarrollo |

### Para REPARTIDORES 🚴

| Función | Archivo | Estado |
|---------|---------|--------|
| Registrarse | `serepartidor.html` | ✅ Completo |
| Ver entregas | `dashboard/repartidor.html` | 🔨 En desarrollo |
| Aceptar orden | Dashboard | 🔨 En desarrollo |
| Actualizar ubicación | Mapa | 🔨 En desarrollo |
| Marcar entregado | Dashboard | 🔨 En desarrollo |
| Ganancias | Dashboard | 🔨 En desarrollo |

---

## 📖 GUÍA DE USO - CLIENTE

### 1️⃣ REGISTRARSE

**URL:** `http://localhost:3000/Client/auth/register.html`

**Pasos:**
1. Haz clic en "Registrarse" en la página inicio
2. Completa el formulario:
   - Nombre: `Juan`
   - Apellido: `Pérez`
   - Email: `juan@email.com`
   - Teléfono: `987654321` (9 dígitos)
   - Dirección: `Calle Principal 123, Apt 4B`
   - Contraseña: Mín. 6 caracteres
3. Acepta términos y condiciones
4. Haz clic en "Crear Cuenta"
5. **Se abrirá una ventana** para confirmar tu email
6. Confirma tu email en la ventana
7. Se te redirige automáticamente a login

### 2️⃣ INICIAR SESIÓN

**URL:** `http://localhost:3000/Client/auth/login.html`

**Pasos:**
1. Ingresa tu email registrado
2. Ingresa tu contraseña
3. Haz clic en "Ingresar"
4. Se abre tu dashboard personal

### 3️⃣ VER RESTAURANTES

**URL:** `http://localhost:3000/Client/restaurantes.html`

**Características:**
- Lista de 15 restaurantes disponibles
- Filtrar por tipo de comida
- Búsqueda por nombre
- Ver calificación y tiempo de entrega
- Haz clic para ver menú

### 4️⃣ HACER UN PEDIDO

**Proceso:**
1. Selecciona restaurante
2. Elige productos del menú
3. Selecciona tamaño (Si, M, L, etc.)
4. Agrega cantidad
5. Haz clic "Agregar al carrito"
6. Continúa comprando o ir a carrito
7. En carrito: revisa total
8. Haz clic "Ir a Pagar"
9. Selecciona dirección de entrega
10. Confirma pago
11. ✅ Orden creada

### 5️⃣ VER MIS PEDIDOS

**URL:** `http://localhost:3000/Client/dashboard/cliente.html`

**Información disponible:**
- Pedidos activos (en preparación/en camino)
- Historial de pedidos
- Detalles: restaurante, productos, total, ETA
- Rastreo en tiempo real

---

## 🍔 GUÍA DE USO - RESTAURANTE

### 1️⃣ REGISTRAR MI RESTAURANTE

**URL:** `http://localhost:3000/Client/agregarestaurante.html`

**Pasos:**
1. Completa datos del restaurante:
   - Nombre: `La Pizzería de Juan`
   - Email: `pizzeria@email.com`
   - Contraseña: Mín. 6 caracteres
   - Teléfono: `987654321`
   - Dirección: `Av. Principal 456`
   - Tipo de comida: `Pizzería`
   - Tiempo de entrega: `30 minutos`
2. Haz clic "Registrar Restaurante"
3. Confirma email en ventana que se abre
4. Inicia sesión
5. Accedes a tu dashboard

### 2️⃣ CREAR PRODUCTOS

**URL:** `http://localhost:3000/Client/dashboard/restaurante.html`

**Proceso:**
1. Haz clic "Agregar Producto"
2. Completa:
   - Nombre: `Pizza Margarita`
   - Descripción: `Pizza fresca con queso mozzarella`
   - Precio base: `25.00`
   - Imagen: Sube foto
3. Agrega tamaños:
   - Pequeño: +0% (S)
   - Mediano: +30% (M)
   - Grande: +50% (L)
4. Haz clic "Guardar Producto"
5. El producto aparece en tu menú

### 3️⃣ VER ÓRDENES PENDIENTES

**Dashboard → Sección "Órdenes"**

**Información:**
- Cliente y dirección
- Productos ordenados
- Total a pagar
- Hora de llegada esperada

**Acciones:**
- ✅ Marcar como "Preparando"
- ✅ Marcar como "Listo para recoger"
- ❌ Rechazar orden (si es necesario)

### 4️⃣ REPORTES DE VENTAS

**Dashboard → Sección "Reportes"**

**Visualizaciones:**
- Ingresos del día/mes
- Productos más vendidos
- Horarios pico
- Rating promedio

---

## 🚴 GUÍA DE USO - REPARTIDOR

### 1️⃣ REGISTRARSE

**URL:** `http://localhost:3000/Client/serepartidor.html`

**Pasos:**
1. Completa datos:
   - Nombre: `Carlos`
   - Apellido: `García`
   - Email: `carlos@email.com`
   - Teléfono: `987654321`
   - Vehículo: `Motocicleta` / `Bicicleta`
   - Placa: `ABC-123`
2. Carga documentos:
   - Licencia de conducir
   - Seguro
3. Haz clic "Registrarse"
4. Espera aprobación de admin
5. Recibe notificación cuando esté activo

### 2️⃣ VER ENTREGAS DISPONIBLES

**Dashboard → "Entregas Disponibles"**

**Información:**
- Restaurante
- Dirección entrega
- Distancia
- Pago estimado
- Cliente

**Acción:** Haz clic "Aceptar Entrega"

### 3️⃣ REALIZAR ENTREGA

**Proceso:**
1. Recoges el pedido del restaurante
2. Confirmas recepción en app
3. Mapa muestra ruta al cliente
4. Actualiza tu ubicación en tiempo real
5. Llegas a dirección
6. Cliente recibe y firma
7. Marca como "Entregado"
8. Recibes tu pago

### 4️⃣ VER GANANCIAS

**Dashboard → "Mis Ganancias"**

**Información:**
- Ganancias del día/mes
- Entregas completadas
- Calificación promedio
- Bonificaciones

---

## 🔧 REFERENCIA TÉCNICA

### ENDPOINTS DE API (Backend)

**Base:** `http://localhost:3000/api`

#### Autenticación
```
POST   /auth/register/cliente        ← Registro cliente
POST   /auth/register/restaurante    ← Registro restaurante
POST   /auth/register/repartidor     ← Registro repartidor
POST   /auth/login                   ← Login cualquier usuario
POST   /auth/logout                  ← Logout
POST   /auth/refresh                 ← Refrescar token
GET    /auth/verify                  ← Verificar token
```

#### Restaurantes
```
GET    /restaurants                  ← Listar todos
GET    /restaurants/:id              ← Obtener uno
POST   /restaurants                  ← Crear (autenticado)
PUT    /restaurants/:id              ← Actualizar (autenticado)
DELETE /restaurants/:id              ← Eliminar (admin)
```

#### Productos
```
GET    /products                     ← Listar todos
GET    /products/:id                 ← Obtener uno
GET    /products/restaurant/:id      ← Productos de restaurante
POST   /products                     ← Crear (restaurante)
PUT    /products/:id                 ← Actualizar (restaurante)
DELETE /products/:id                 ← Eliminar (restaurante)
```

#### Órdenes
```
GET    /orders                       ← Mis órdenes
GET    /orders/:id                   ← Detalle orden
POST   /orders                       ← Crear orden
PUT    /orders/:id                   ← Actualizar estado
GET    /orders/restaurant/:id        ← Órdenes de mi restaurante
GET    /orders/delivery/:id          ← Entregas para mí
```

### ESTRUCTURA BASE DE DATOS

#### Tabla: usuarios
```sql
id (UUID) → PK
email (VARCHAR) → UNIQUE
password_hash (TEXT)
nombres (VARCHAR)
apellidos (VARCHAR)
telefono (VARCHAR)
direccion (TEXT)
role (VARCHAR) → 'cliente', 'restaurante', 'repartidor', 'admin'
estado (VARCHAR) → 'activo', 'inactivo', 'pendiente'
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### Tabla: restaurantes
```sql
id (UUID) → PK
usuario_id (UUID) → FK usuarios
nombre (VARCHAR)
descripcion (TEXT)
direccion (TEXT)
telefono (VARCHAR)
email (VARCHAR)
tipo_comida (VARCHAR)
tiempo_delivery (INT)
calificacion (DECIMAL)
restaurante_url (TEXT)
created_at (TIMESTAMP)
```

#### Tabla: productos
```sql
id (UUID) → PK
restaurante_id (UUID) → FK restaurantes
nombre (VARCHAR)
descripcion (TEXT)
precio_base (DECIMAL)
imagen_url (TEXT)
disponible (BOOLEAN)
created_at (TIMESTAMP)
```

#### Tabla: tamaños
```sql
id (SERIAL) → PK  ✅ AUTO-INCREMENT
producto_id (UUID) → FK productos
nombre (VARCHAR) → 'S', 'M', 'L', 'XL'
multiplicador (DECIMAL) → 1.0, 1.3, 1.5, 1.8
created_at (TIMESTAMP)
```

### AUTENTICACIÓN Y TOKENS

**Sistema:** JWT (JSON Web Tokens)

**Ubicación en Frontend:**
- Guardado en: `localStorage['supabaseAuthToken']`
- Usado en: Todas las requests autenticadas
- Header: `Authorization: Bearer {token}`

**Variables Globales:**
```javascript
window.authManager          // Gestor de autenticación
window.rapiRushAPI         // Wrapper de API
window.cart                // Carrito de compras
```

### CONFIGURACIÓN LOCAL

#### Instalar y Ejecutar Backend
```bash
cd server
npm install
npm start
# Servidor en: http://localhost:3000
```

#### Abrir Frontend
```bash
# Opción 1: Navegador directo
# Abre: Client/index.html

# Opción 2: Servidor local
cd Client
npx http-server . -p 8080
# Abre: http://localhost:8080
```

#### Variables de Entorno (server/.env)
```
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
PORT=3000
NODE_ENV=development
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### ❌ "Error de conexión a API"

**Causa:** Backend no está corriendo

**Solución:**
```bash
cd server
npm start
# Verificar puerto 3000 disponible
```

### ❌ "Cannot find module 'supabase'"

**Causa:** Falta instalar dependencias

**Solución:**
```bash
cd server
npm install
```

### ❌ "Error de autenticación al registrarse"

**Causa Posible:** Email ya existe

**Solución:** Usa un email diferente

**Causa 2:** Contraseña muy corta

**Solución:** Mín. 6 caracteres

### ❌ "No puedo confirmar email"

**Problema:** Ventana emergente bloqueada

**Solución:** Permite pop-ups en navegador

**Pasos (Chrome):**
1. Haz clic en el icono de Pop-up bloqueado (esquina derecha)
2. Haz clic en "Permitir para este sitio"
3. Intenta registrarte de nuevo

### ❌ "Carrito vacío después de agregar productos"

**Causa:** Cache no actualizado

**Solución:** Limpia cache del navegador
```
Ctrl + Shift + Delete → Cookies y datos de sitios → Limpiar
```

### ❌ "Dashboard muestra 'Usuario' en lugar de mi nombre"

**Causa:** Token no se guardó correctamente

**Solución:** 
1. Cierra sesión
2. Limpia datos del navegador
3. Inicia sesión de nuevo

### ❌ "Localhost rechazado en navegador"

**Causa:** Backend no está corriendo

**Solución:** Ejecuta en terminal:
```bash
cd server && npm start
```

### ❌ "Puerto 3000 ya en uso"

**Solución:**
```powershell
# Windows - Encontrar y matar proceso
Get-Process -Name node
Stop-Process -Name node -Force

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 📚 ARCHIVOS DOCUMENTACIÓN

**Mantener solo:**
- ✅ `AVANCE.md` - Estado actual del proyecto
- ✅ `INDICE_GENERAL.md` - Este archivo (guía de navegación)

**Eliminar (obsoletos):**
- ❌ `ESTADO_FINAL_PROYECTO.md`
- ❌ `START_HERE.md`
- ❌ `REFERENCIA_RAPIDA.md`
- ❌ `GUIA_EJECUCION_SQL.md`
- ❌ `CHECKLIST_EJECUCION_SQL.md`
- ❌ `RESUMEN_SQL_COMPLETO.md`
- ❌ `INDICE_COMPLETO.md`
- ❌ `README_FINAL.md`

---

## 🎯 PRÓXIMAS CARACTERÍSTICAS (Roadmap)

### Q1 2024
- [ ] Sistema de calificaciones y comentarios
- [ ] Favoritos de restaurantes/productos
- [ ] Edición de perfil de usuario
- [ ] Dashboard restaurante mejorado

### Q2 2024
- [ ] Integración de pagos (Stripe/PayPal)
- [ ] Sistema de notificaciones push
- [ ] Mapa en tiempo real de entregas
- [ ] Chat entre cliente-repartidor

### Q3 2024
- [ ] Sistema de promociones y descuentos
- [ ] Programa de lealtad
- [ ] App móvil (React Native)
- [ ] Análisis de datos avanzado

---

## ✉️ CONTACTO Y SOPORTE

- **Email:** soporte@rapirush.com
- **GitHub:** https://github.com/tuusuario/rapirush
- **Issues:** Reporta en GitHub Issues

---

**Última actualización:** 2024  
**Versión:** 1.0  
**Mantenedor:** Equipo RapiRush
