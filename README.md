# Proyecto Node.js + Express

## 📌 Descripción
Este proyecto es una aplicación backend construida con **Node.js** y **Express**.  
Incluye endpoints REST para manejar recursos y puede conectarse a una base de datos MySQL/MongoDB según la configuración.

## 🚀 Requisitos
- Node.js >= 18
- npm o yarn
- (Opcional) Base de datos MySQL/MongoDB

## ⚙️ Instalación
Clona el repositorio y ejecuta:

```bash
git clone https://github.com/usuario/proyecto.git
cd proyecto
npm install

##Uso
 - npm run dev

 # 🚀 INSTRUCCIONES PARA EJECUTAR RAPIRUST

## Requisitos Previos
- Node.js >= 18 instalado
- npm instalado
- Un servidor local para el cliente (Live Server en VS Code recomendado)
- Acceso a Supabase con las credenciales configuradas

---

## 1️⃣ INICIAR EL SERVIDOR (BACKEND)

### En una terminal:
```bash
cd d:\RapiRush\server
npm install  # Solo la primera vez
npm run dev
```

### Esperado:
```
🚀 Servidor RapiRush corriendo en http://localhost:3000
📊 Panel de salud: http://localhost:3000/api/health
🔗 Prueba Supabase: http://localhost:3000/api/supabase-test
🔐 Rutas Auth disponibles en: http://localhost:3000/api/auth
⚙️  Configuración: http://localhost:3000/api/config
🚀 Iniciando scheduler de aprobación automática...
```

---

## 2️⃣ ABRIR EL CLIENTE (FRONTEND)

### Opción A: Live Server en VS Code
1. Click derecho en `d:\RapiRush\Client\index.html`
2. Seleccionar "Open with Live Server"
3. Navegador se abrirá en `http://localhost:5500/Client/` (o similar)

### Opción B: Servidor Python simple
```bash
cd d:\RapiRush\Client
python -m http.server 8000
# Navega a http://localhost:8000
```

---

## 3️⃣ FLUJO DE PRUEBA COMPLETO

### A. Inicio (index.html)
- [ ] Página carga correctamente
- [ ] NavBar visible con "Registrarse" e "Iniciar Sesión"
- [ ] Hero section se muestra
- [ ] Buscador funciona

### B. Registro Cliente (auth/register.html)
- [ ] Formulario visible
- [ ] Campos: Nombre, Email, Teléfono, Contraseña
- [ ] Completar y enviar
- [ ] Verificar en Supabase:
  ```
  Tabla: usuarios → id, rol='cliente', estado='pendiente'
  Tabla: clientes → nombres, telefono, direccion
  ```

### C. Esperar 3 minutos
- [ ] El estado debe cambiar automáticamente de "pendiente" a "aprobado"
- [ ] Verifica en Supabase cada 30 segundos

### D. Login (auth/login.html)
- [ ] Usar email y contraseña del registro
- [ ] Click en "Iniciar Sesión"
- [ ] Redirige a dashboard/cliente.html

### E. Ver Restaurantes (restaurantes.html)
- [ ] Navegas a "Restaurantes"
- [ ] Se cargan restaurantes con paginación
- [ ] Puedes hacer click en uno para ver menú

### F. Carrito (carrito.html)
- [ ] Agregar productos al carrito
- [ ] Contador de carrito actualiza
- [ ] Click en "Proceder al Pago"

### G. Checkout (checkout.html)
- [ ] Formulario de dirección precargado
- [ ] Tres métodos de pago:
  - [ ] Efectivo
  - [ ] Tarjeta (formulario aparece)
  - [ ] **Yape/Plin** (QR aparece) ✨
- [ ] Resumen de pedido visible
- [ ] Click en "Confirmar pedido"

### H. Confirmación
- [ ] Modal muestra "Pedido confirmado"
- [ ] Número de pedido asignado
- [ ] Redirige a dashboard/cliente.html

---

## 4️⃣ PRUEBAS ADICIONALES

### Registro de Restaurante (agregarestaurante.html)
- [ ] Formulario con campos: nombre, email, teléfono, dirección, tipo comida
- [ ] Registra como rol='restaurante'
- [ ] Verificar en Supabase tabla "restaurantes"

### Registro de Repartidor (serepartidor.html)
- [ ] Formulario con campos: nombre, email, teléfono, vehículo
- [ ] Registra como rol='repartidor'
- [ ] Verificar en Supabase tabla "repartidores"

### Performance
- [ ] CSS cargado (styles.css ~280 líneas vs 1210 antes)
- [ ] Restaurantes cargados con paginación
- [ ] Sin errores en consola del navegador
- [ ] Red en DevTools muestra < 1MB total

---

## 5️⃣ ENDPOINTS ÚTILES PARA PROBAR

### En Postman o curl:

```bash
# Salud del servidor
curl http://localhost:3000/api/health

# Verificar Supabase
curl http://localhost:3000/api/supabase-test

# Obtener restaurantes (página 1, 12 por página)
curl http://localhost:3000/api/restaurants?page=1&limit=12

# Detalle de restaurante
curl http://localhost:3000/api/restaurants/10000000-0000-0000-0000-000000000001

# Registro cliente
curl -X POST http://localhost:3000/api/auth/register/cliente \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "userData": {
      "nombres": "Juan Pérez",
      "telefono": "987654321",
      "direccion": "Calle Principal 123"
    }
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

---

## 6️⃣ SOLUCIÓN DE PROBLEMAS

### ❌ "Servidor no responde (Cannot GET /api/restaurants)"
- Verificar que `npm run dev` esté ejecutándose en `server/`
- Verificar puerto 3000 no esté ocupado
- Verificar .env en server/ tenga SUPABASE_URL y SUPABASE_SERVICE_KEY

### ❌ "CORS bloqueado"
- Verificar origen en frontend (http://localhost:5500)
- Verificar que esté en allowedOrigins en index.js

### ❌ "Error en Supabase"
- Verificar credenciales en .env
- Verificar que las tablas existan en Supabase
- Verificar políticas de RLS (Row Level Security) si están habilitadas

### ❌ "Usuario no se aprueba después de 3 minutos"
- Verificar que el scheduler esté ejecutándose (ver console del servidor)
- Verificar que el campo `estado` existe en tabla `usuarios`
- Verificar que `created_at` está siendo guardado

### ❌ "QR no aparece en checkout"
- Verificar que QRCode library está cargado en checkout.html
- Verificar en console del navegador si hay errores
- Verificar que Yape/Plin esté seleccionado

---

## 7️⃣ BASE DE DATOS - CREAR TABLAS SI NO EXISTEN

En Supabase SQL Editor:

```sql
-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY,
  rol TEXT DEFAULT 'cliente',
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY,
  nombres TEXT,
  telefono TEXT,
  direccion TEXT,
  email TEXT
);

-- Tabla restaurantes
CREATE TABLE IF NOT EXISTS restaurantes (
  id UUID PRIMARY KEY,
  nombre TEXT,
  telefono TEXT,
  direccion TEXT,
  etiquetas TEXT,
  abierto BOOLEAN DEFAULT FALSE,
  tiempo_delivery INTEGER DEFAULT 30,
  delivery_cost DECIMAL DEFAULT 2.50,
  descripcion TEXT,
  rating DECIMAL DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  image_url TEXT
);

-- Tabla repartidores
CREATE TABLE IF NOT EXISTS repartidores (
  id UUID PRIMARY KEY,
  nombre TEXT,
  telefono TEXT,
  tipo_vehiculo TEXT
);

-- Tabla pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY,
  usuario_id UUID,
  monto DECIMAL,
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 CHECKLIST FINAL

- [ ] Servidor corriendo en localhost:3000
- [ ] Frontend cargando en localhost:5500
- [ ] Registro de usuario funciona
- [ ] Datos enviados a Supabase correctamente
- [ ] Aprobación automática en 3 minutos funciona
- [ ] Login redirige al dashboard
- [ ] Carrito agrega/quita productos
- [ ] Checkout muestra 3 métodos de pago
- [ ] QR de Yape/Plin se genera
- [ ] Pedido se crea y confirma
- [ ] CSS es rápido (280 líneas)
- [ ] Restaurantes cargan con paginación
- [ ] No hay errores en consola

---

## ✅ ¡LISTO PARA PRESENTAR!

Si todos los puntos están marcados, tu aplicación está lista para la presentación de mañana.

**Fecha**: 27 de Noviembre, 2025
**Estado**: ✅ Completamente funcional
**Última actualización**: Hoy
