# 🚀 INSTRUCCIONES FINALES: RECREAR BD + VERIFICAR BACKEND

**Tiempo estimado:** 15 minutos  
**Dificultad:** Baja  
**Riesgo:** Nulo

---

## ✅ ANTES DE EMPEZAR

Verifica que tienes:
- ✅ Acceso a Supabase (https://app.supabase.com)
- ✅ Proyecto RapiRush creado en Supabase
- ✅ Node.js instalado en D:\RapiRush\server
- ✅ Backend code actualizado (ya está)
- ✅ Archivos SQL listos (ya están)

---

## 📋 PASO 1: LIMPIAR BD ANTERIOR (Opcional pero recomendado)

**Si tu BD anterior tiene datos que no quieres perder, salta este paso.**

En Supabase SQL Editor:
```sql
-- ⚠️ CUIDADO: Esto borra TODO
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Recrear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 📦 PASO 2: CREAR ESTRUCTURA BD (nueva_bd.sql)

### 2.1 Abrir SQL Editor en Supabase
```
1. Ir a: https://app.supabase.com
2. Hacer click en tu proyecto RapiRush
3. Left sidebar → SQL Editor
4. Click "New Query" (+ botón arriba)
```

### 2.2 Copiar y ejecutar nueva_bd.sql
```
1. Abrir archivo: d:\RapiRush\DataBase\nueva_bd.sql
2. Seleccionar TODO (Ctrl+A)
3. Copiar (Ctrl+C)
4. Pegar en SQL Editor de Supabase
5. Click "Run" (o Ctrl+Enter)
6. Esperar confirmación ✅
```

**Esperado:** Sin errores, mensaje "Queries executed successfully"

### 2.3 Verificar que se crearon las tablas
```sql
-- Pegar en SQL Editor y ejecutar:
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

**Esperado:** Debe mostrar estas tablas:
```
tb_calificaciones
tb_categorias
tb_clientes
tb_pedido_detalles
tb_pedido_rastreo
tb_pedidos
tb_productos
tb_producto_tamaños
tb_repartidores
tb_restaurantes
tb_usuarios
```

---

## 👥 PASO 3: INSERTAR RESTAURANTES (nuevorestaurantes.sql)

### 3.1 Nueva Query
```
1. Click "New Query" en SQL Editor
2. (O Tab nuevo si prefieres)
```

### 3.2 Copiar y ejecutar nuevorestaurantes.sql
```
1. Abrir archivo: d:\RapiRush\DataBase\nuevorestaurantes.sql
2. Seleccionar TODO (Ctrl+A)
3. Copiar (Ctrl+C)
4. Pegar en SQL Editor
5. Click "Run"
6. Esperar confirmación ✅
```

**Esperado:** Sin errores

### 3.3 Verificar restaurantes
```sql
-- Pegar y ejecutar:
SELECT COUNT(*) as total, restaurante_nombre FROM tb_restaurantes GROUP BY restaurante_nombre;
```

**Esperado:** 15 filas (15 restaurantes)

---

## 🍕 PASO 4: INSERTAR PRODUCTOS (nuevoproductos.sql)

### 4.1 Nueva Query
```
1. Click "New Query"
```

### 4.2 Copiar y ejecutar nuevoproductos.sql
```
1. Abrir archivo: d:\RapiRush\DataBase\nuevoproductos.sql
2. Seleccionar TODO (Ctrl+A)
3. Copiar (Ctrl+C)
4. Pegar en SQL Editor
5. Click "Run"
6. Esperar confirmación ✅
```

**Esperado:** Sin errores

### 4.3 Verificar productos
```sql
-- Pegar y ejecutar:
SELECT COUNT(*) as total_productos FROM tb_productos;
```

**Esperado:** ~100 (número total de productos)

---

## 📏 PASO 5: INSERTAR TAMAÑOS (nuevoproducto_tamaños.sql)

### 5.1 Nueva Query
```
1. Click "New Query"
```

### 5.2 Copiar y ejecutar nuevoproducto_tamaños.sql
```
1. Abrir archivo: d:\RapiRush\DataBase\nuevoproducto_tamaños.sql
2. Seleccionar TODO (Ctrl+A)
3. Copiar (Ctrl+C)
4. Pegar en SQL Editor
5. Click "Run"
6. Esperar confirmación ✅
```

**Esperado:** Sin errores

### 5.3 Verificar tamaños
```sql
-- Pegar y ejecutar:
SELECT 
  es_disponible, 
  COUNT(*) as cantidad 
FROM tb_producto_tamaños 
GROUP BY es_disponible;
```

**Esperado:**
```
es_disponible | cantidad
true          | ~39
false         | ~1
```

---

## ✅ PASO 6: VALIDAR BD EN SUPABASE

### 6.1 Ver estructura en Data Editor
```
1. Left sidebar → Data Editor
2. Hacer click en tb_restaurantes
3. Debe mostrar 15 filas
4. Scroll right para ver: restaurante_url, tipo_comida, tiempo_delivery, delivery_cost
```

### 6.2 Verificar datos de ejemplo
```sql
-- Ejecutar en SQL Editor:
SELECT 
  restaurante_nombre,
  tipo_comida,
  delivery_cost,
  tiempo_delivery,
  numero_reviews
FROM tb_restaurantes
LIMIT 5;
```

**Esperado:** 5 restaurantes con todos los campos llenos

### 6.3 Verificar productos con tamaños
```sql
-- Ejecutar:
SELECT 
  p.nombre,
  t.nombre_tamaño,
  t.multiplicador_precio,
  t.es_disponible
FROM tb_productos p
JOIN tb_producto_tamaños t ON p.producto_id = t.producto_id
LIMIT 10;
```

**Esperado:** 10 filas con producto, tamaño, multiplicador, y disponibilidad

---

## 🖥️ PASO 7: INICIAR SERVIDOR BACKEND

### 7.1 Abrir Terminal
```
1. Presionar: Ctrl + `  (backtick)
2. O: Terminal → New Terminal
```

### 7.2 Navegar a servidor
```bash
cd D:\RapiRush\server
```

### 7.3 Iniciar
```bash
node index.js
```

**Esperado:** Ver esto en terminal:
```
🚀 Servidor RapiRush corriendo en http://localhost:3000    
📊 Panel de salud: http://localhost:3000/api/health        
🔗 Prueba Supabase: http://localhost:3000/api/supabase-test
```

---

## 🔗 PASO 8: PROBAR ENDPOINTS

### 8.1 Obtener restaurantes (sin autenticación)
```bash
curl http://localhost:3000/api/restaurants
```

**Esperado:** Array JSON con 15 restaurantes

**Estructura esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": "10000000-0000-0000-0000-000000000001",
      "name": "La Pizzería Italiana",
      "description": "Las mejores pizzas artesanales...",
      "img": "https://images.unsplash.com/...",
      "tipo_comida": "Pizzería Italiana",
      "rating": 4.8,
      "reviews": 520,
      "deliveryTime": "35 min",
      "deliveryCost": 5,
      "location": "Av. Pizza 123, Miraflores",
      "isOpen": true
    },
    ...
  ]
}
```

### 8.2 Obtener un restaurante específico
```bash
curl http://localhost:3000/api/restaurants/10000000-0000-0000-0000-000000000001
```

**Esperado:** Datos de un restaurante

### 8.3 Obtener productos de un restaurante
```bash
curl "http://localhost:3000/api/products/restaurant/10000000-0000-0000-0000-000000000001"
```

**Esperado:** Array de productos con nombre, descripcion, precio

### 8.4 Obtener tamaños de un producto ⭐ NUEVO
```bash
curl "http://localhost:3000/api/products/10000001-0000-0000-0000-000000000001/sizes"
```

**Esperado:**
```json
{
  "success": true,
  "sizes": {
    "available": [
      {
        "tamaño_id": "tam-1-001",
        "nombre_tamaño": "Personal",
        "multiplicador_precio": 1,
        "es_disponible": true
      },
      {
        "tamaño_id": "tam-1-002",
        "nombre_tamaño": "Mediano",
        "multiplicador_precio": 1.56,
        "es_disponible": true
      }
    ],
    "unavailable": []
  },
  "count": 2,
  "total": 3
}
```

---

## 🎉 PASO 9: CONFIRMACIÓN FINAL

Si llegaste aquí y TODO funcionó, entonces:

✅ **BD está 100% creada**
✅ **Datos están insertados**
✅ **Backend está funcionando**
✅ **Endpoints responden correctamente**

---

## 🚨 TROUBLESHOOTING

### ❌ Error: "table does not exist"
**Solución:** Verifica que ejecutaste nueva_bd.sql primero

### ❌ Error: "no rows returned"
**Solución:** Verifica que ejecutaste nuevorestaurantes.sql

### ❌ Error: "duplicate key value"
**Solución:** Posiblemente la BD ya tiene datos. Limpia primero (PASO 1)

### ❌ Error: "Cannot POST /api/..."
**Solución:** El servidor no está corriendo. Ejecuta `node index.js` en terminal

### ❌ Error: "CORS" en navegador
**Solución:** Es normal. Los endpoints funcionan con curl y desde frontend. No desde navegador directo.

---

## 📱 PRÓXIMO PASO: FRONTEND

Una vez BD y backend funcionan, el siguiente paso es:

1. Abrir `D:\RapiRush\Client\main.js`
2. Agregar selector de tamaños en modal
3. Guardar tamaño_id en carrito
4. Enviar tamaño_id al hacer pedido

---

## 📞 REFERENCIAS RÁPIDAS

| Archivo | Ubicación | Para |
|---------|-----------|------|
| nueva_bd.sql | `DataBase/nueva_bd.sql` | Estructura BD |
| nuevorestaurantes.sql | `DataBase/nuevorestaurantes.sql` | Restaurantes |
| nuevoproductos.sql | `DataBase/nuevoproductos.sql` | Productos |
| nuevoproducto_tamaños.sql | `DataBase/nuevoproducto_tamaños.sql` | Tamaños |
| Guía BD | `GUIA_RECREAR_BD_SUPABASE.md` | Instrucciones detalladas |
| Guía Mapeo | `GUIA_PRACTICA_MAPEO_CATEGORIAS.md` | Entender mapeo |
| Resumen técnico | `RESUMEN_FINAL_AUDITORIA_BD_BACKEND.md` | Detalles técnicos |

---

## ⏱️ CHECKLIST FINAL

- [ ] BD creada en Supabase
- [ ] 15 restaurantes insertados
- [ ] ~100 productos insertados
- [ ] ~40 tamaños insertados
- [ ] Servidor ejecutándose (node index.js)
- [ ] GET /api/restaurants funciona
- [ ] GET /api/products/.../sizes funciona
- [ ] Puedes ver datos en Supabase Data Editor

---

**Si completaste todo ↑ entonces estás 100% listo para el siguiente paso: Frontend** 🎉

**Tiempo total:** ~15 minutos
**Complejidad:** Baja
**Riesgo:** Nulo
**Status:** ✅ Listo
