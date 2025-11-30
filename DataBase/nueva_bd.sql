
-- TABLA 1: tb_usuarios (control central - vinculado con Supabase Auth)

CREATE TABLE IF NOT EXISTS tb_usuarios (
  usuario_id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('cliente', 'restaurante', 'repartidor', 'admin')),
  estado VARCHAR(50) DEFAULT 'activo',
  
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLA 2: tb_categorias (simple lista de categorías)
CREATE TABLE IF NOT EXISTS tb_categorias (
  categoria_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  icono VARCHAR(50)
);

-- Insertar categorías por defecto
INSERT INTO tb_categorias (nombre, descripcion, icono) VALUES
  ('Comida Rápida', 'Hamburguesas, hot dogs, pizzas', '🍔'),
  ('Asiática', 'Chino, japonés, tailandés', '🍜'),
  ('Italiana', 'Pasta, risotto, pizza italiana', '🍝'),
  ('Mexicana', 'Tacos, enchiladas, quesadillas', '🌮'),
  ('Vegetariana', 'Platos sin carne', '🥗'),
  ('Postres', 'Pasteles, helados, dulces', '🍰'),
  ('Bebidas', 'Jugos, batidos, bebidas', '🥤'),
  ('Panadería', 'Pan, arepas, galletas', '🥐')
ON CONFLICT (nombre) DO NOTHING;

-- TABLA 3: tb_clientes
CREATE TABLE IF NOT EXISTS tb_clientes (
  cliente_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES tb_usuarios(usuario_id) ON DELETE CASCADE,
  
  cliente_nombre VARCHAR(100) NOT NULL,
  cliente_apellido VARCHAR(100) NOT NULL,
  cliente_email VARCHAR(255) NOT NULL,
  cliente_telefono VARCHAR(20),
  cliente_direccion TEXT,

  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLA 4: tb_restaurantes
CREATE TABLE IF NOT EXISTS tb_restaurantes (
  restaurante_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES tb_usuarios(usuario_id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES tb_categorias(categoria_id),
  
  restaurante_nombre VARCHAR(150) NOT NULL,
  restaurante_email VARCHAR(255) NOT NULL,
  restaurante_telefono VARCHAR(20),
  restaurante_descripcion TEXT,
  restaurante_direccion TEXT NOT NULL,
  restaurante_url VARCHAR(500),
  tipo_comida VARCHAR(100),
  tiempo_delivery INT DEFAULT 30,
  delivery_cost DECIMAL(10, 2) DEFAULT 0,
  numero_reviews INT DEFAULT 0,
  
  es_abierto BOOLEAN DEFAULT TRUE,
  es_verificado BOOLEAN DEFAULT FALSE,
  calificacion_promedio DECIMAL(3, 2) DEFAULT 0,
  
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLA 5: tb_repartidores
CREATE TABLE IF NOT EXISTS tb_repartidores (
  repartidor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES tb_usuarios(usuario_id) ON DELETE CASCADE,
  
  repartidor_nombre VARCHAR(100) NOT NULL,
  repartidor_apellido VARCHAR(100) NOT NULL,
  repartidor_email VARCHAR(255) NOT NULL,
  repartidor_telefono VARCHAR(20),
  
  tipo_vehiculo VARCHAR(50) NOT NULL CHECK (tipo_vehiculo IN ('Bicicleta', 'Moto', 'Auto', 'Scooter')),
  placa VARCHAR(20),
  
  es_disponible BOOLEAN DEFAULT FALSE,
  es_verificado BOOLEAN DEFAULT FALSE,
  calificacion_promedio DECIMAL(3, 2) DEFAULT 0,
  
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLA 6: tb_productos
CREATE TABLE IF NOT EXISTS tb_productos (
  producto_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurante_id UUID NOT NULL REFERENCES tb_restaurantes(restaurante_id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES tb_categorias(categoria_id),
  
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0),
  
  es_disponible BOOLEAN DEFAULT TRUE,
  imagen_url VARCHAR(500),
  
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ✨ TABLA 6.1: tb_producto_tamaños (NUEVA - Maneja variaciones de precio por tamaño)
CREATE TABLE IF NOT EXISTS tb_producto_tamaños (
  tamaño_id SERIAL PRIMARY KEY,
  producto_id UUID NOT NULL REFERENCES tb_productos(producto_id) ON DELETE CASCADE,
  
  nombre_tamaño VARCHAR(50) NOT NULL,
  multiplicador_precio DECIMAL(5, 2) NOT NULL DEFAULT 1.0,
  es_disponible BOOLEAN DEFAULT TRUE,
  
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(producto_id, nombre_tamaño)
);

-- TABLA 7: tb_pedidos (con todos los datos del checkout)
CREATE TABLE IF NOT EXISTS tb_pedidos (
  pedido_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES tb_clientes(cliente_id) ON DELETE CASCADE,
  restaurante_id UUID NOT NULL REFERENCES tb_restaurantes(restaurante_id) ON DELETE CASCADE,
  repartidor_id UUID REFERENCES tb_repartidores(repartidor_id) ON DELETE SET NULL,
  
  numero_pedido VARCHAR(50) NOT NULL UNIQUE,
  estado VARCHAR(50) DEFAULT 'recibido' 
    CHECK (estado IN ('recibido', 'aceptado', 'preparando', 'listo', 'camino', 'llegado', 'entregado', 'cancelado')),
  
  -- DATOS DE ENTREGA (del checkout)
  nombre_cliente VARCHAR(100) NOT NULL,
  telefono_cliente VARCHAR(20),
  direccion_entrega TEXT NOT NULL,
  distrito VARCHAR(100),
  referencia TEXT,
  notas_adicionales TEXT,
  
  -- TOTALES
  subtotal DECIMAL(10, 2) DEFAULT 0,
  costo_envio DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  
  -- MÉTODO DE PAGO
  metodo_pago VARCHAR(50) DEFAULT 'efectivo' CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'digital')),
  
  -- TIMESTAMPS
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega TIMESTAMP WITH TIME ZONE
);

-- TABLA 8: tb_pedido_detalles (items del pedido)
CREATE TABLE IF NOT EXISTS tb_pedido_detalles (
  detalle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES tb_pedidos(pedido_id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES tb_productos(producto_id) ON DELETE CASCADE,
  tamaño_id INTEGER REFERENCES tb_producto_tamaños(tamaño_id) ON DELETE SET NULL,
  
  nombre_producto VARCHAR(150) NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  
  -- NOTAS DEL CLIENTE (Ej: "Sin cebolla", "Extra queso", etc)
  notas_adicionales TEXT,
  
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLA 9: tb_calificaciones 
CREATE TABLE IF NOT EXISTS tb_calificaciones (
  calificacion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES tb_clientes(cliente_id) ON DELETE CASCADE,
  pedido_id UUID NOT NULL REFERENCES tb_pedidos(pedido_id) ON DELETE CASCADE,
  restaurante_id UUID REFERENCES tb_restaurantes(restaurante_id) ON DELETE CASCADE,
  repartidor_id UUID REFERENCES tb_repartidores(repartidor_id) ON DELETE CASCADE,
  
  tipo_calificacion VARCHAR(50) NOT NULL CHECK (tipo_calificacion IN ('restaurante', 'repartidor')),
  puntuacion INTEGER NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
  comentario TEXT,
  
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLA 10: tb_pedido_rastreo (Historial de cambios de estado)
CREATE TABLE IF NOT EXISTS tb_pedido_rastreo (
  rastreo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES tb_pedidos(pedido_id) ON DELETE CASCADE,
  
  estado_anterior VARCHAR(50),
  estado_nuevo VARCHAR(50) NOT NULL,
  
  cambio_por VARCHAR(100) NOT NULL CHECK (cambio_por IN ('restaurante', 'repartidor', 'cliente', 'sistema', 'admin')),
  observaciones TEXT,
  
  fecha_cambio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para queries rápidas por pedido
CREATE INDEX idx_rastreo_pedido ON tb_pedido_rastreo(pedido_id, fecha_cambio DESC);

-- ✅ FIN - BASE DE DATOS LISTA PARA USAR

-- 11 Tablas principales:
-- 1. tb_usuarios - Control central (vinculada a Supabase Auth)
-- 2. tb_categorias - Catálogo de categorías
-- 3. tb_clientes - Datos de clientes
-- 4. tb_restaurantes - Datos de restaurantes + campos de imagen y tipo comida
-- 5. tb_repartidores - Datos de repartidores
-- 6. tb_productos - Productos/menu
-- 6.1. tb_producto_tamaños - Variaciones de tamaño y precio (NUEVA)
-- 7. tb_pedidos - Pedidos (con TODOS los datos del checkout)
-- 8. tb_pedido_detalles - Items del pedido + notas del cliente
-- 9. tb_calificaciones - Ratings
-- 10. tb_pedido_rastreo - Historial de cambios de estado


-PARA el ADMIN  se creo directo en la base de datos  
  -- se inserto estos datos
  INSERT INTO usuarios (id, rol, estado)
VALUES ('f22d19b8-1e03-4a36-95ef-bc34cd1bf2fb', 'admin', 'activo');


⭐ TU BASE DE DATOS FINAL (REPASO)
Tabla	Para qué sirve
auth.users	Usuarios y contraseñas (Supabase Auth)
usuarios	Guarda el rol
clientes	Datos del formulario cliente
restaurantes	Datos del formulario restaurante
repartidores	Datos del formulario repartidor
pedidos	El pedido principal
pedido_items	Los items del pedido
pedido_rastreo	Estados de seguimiento del pedido