# 🚀 FLUJO COMPLETO DE ÓRDENES EN RAPIPRUSH

## 📋 ESTADO ACTUAL DEL SISTEMA

✅ **Sistema completamente funcional**. Ahora puedes:

1. **Registrarte como Restaurante** → Publicar productos → Aceptar/Rechazar pedidos
2. **Registrarte como Repartidor** → Recoger pedidos → Entregarlos
3. **Cliente** → Crear pedidos → Rastrear estado en tiempo real

---

## 🔄 FLUJO COMPLETO DE UNA ORDEN

```
CLIENTE                          RESTAURANTE                    REPARTIDOR
  │                                │                              │
  │─── 1. Crea Pedido ────────────→│                              │
  │  (estado: recibido)             │                              │
  │                                │  Recibe notificación        │
  │                                │                              │
  │                    ┌─→ ✅ Aceptar                             │
  │                    │   (estado: aceptado)                    │
  │  2. Ve "Aceptado" ←│                                          │
  │                    │   👨‍🍳 Preparando                          │
  │                    │   (estado: preparando)                  │
  │  3. Ve "Preparando"│                                          │
  │                    │                                          │
  │                    └─→ 📋 Listo                              │
  │  4. Ve "Listo"        (estado: listo)                        │
  │                                │                  Recibe notificación
  │                                │                              │
  │                                │◄────── ✅ Recoger ──────────│
  │                                │      (estado: en_camino)    │
  │  5. Ve "En Camino" ◄───────────│                              │
  │                                │                  Entregar
  │                                │◄────── 🏁 Llegar ──────────│
  │  6. Ve "Llegado"   ◄───────────│      (estado: llegado)      │
  │                                │                              │
  │  7. Confirma entrega ──────────│────────────────────────────→│
  │  (estado: entregado)           │                              │
  │                                │                              │
  └────────── ✅ ORDEN COMPLETADA ─────────────────────────────┘
```

---

## 🎯 BOTONES DE CONTROL POR DASHBOARD

### 📊 DASHBOARD RESTAURANTE
**Ubicación:** `http://localhost:3000/dashboard/restaurante.html`

#### Tab: "📥 Nuevos" (Estado: recibido)
```
Pedido #12345 - Cliente: Juan Pérez
────────────────────────────────────
🍔 2x Classic Burger
🍕 1x Pizza Margherita
────────────────────────────────────
Total: $47.00

[✅ Aceptar]  [❌ Rechazar]
```
- **Aceptar** → Cambia a "aceptado"
- **Rechazar** → Cambia a "cancelado"

#### Tab: "✅ Aceptados" (Estado: aceptado)
```
Pedido #12345 - Cliente: Juan Pérez
────────────────────────────────────

[👨‍🍳 Preparando]
```
- **Preparando** → Cambia a "preparando"

#### Tab: "👨‍🍳 Preparando" (Estado: preparando)
```
Pedido #12345 - Cliente: Juan Pérez
────────────────────────────────────

[📋 Listo]
```
- **Listo** → Cambia a "listo" (listo para repartidor)

#### Tab: "📋 Listos" (Estado: listo)
```
Pedido #12345 - Cliente: Juan Pérez
────────────────────────────────────
⏰ Esperando que repartidor recoja

(Sin botones - Espera al repartidor)
```

---

### 🚴 DASHBOARD REPARTIDOR
**Ubicación:** `http://localhost:3000/dashboard/repartidor.html`

#### Tab: "📥 Disponibles" (Estado: listo)
```
Pedido #12345 - Cliente: Juan Pérez
Restaurante: La Pizzería Italiana
────────────────────────────────────
Dirección: Calle Principal 123, Lima
────────────────────────────────────

[🚴 Recoger]
```
- **Recoger** → Cambia a "en_camino"

#### Tab: "🚴 En Viaje" (Estado: en_camino)
```
Pedido #12345 - Cliente: Juan Pérez
────────────────────────────────────
Dirección: Calle Principal 123, Lima
────────────────────────────────────

[🏁 Llegar]
```
- **Llegar** → Cambia a "llegado"

#### Tab: "✅ Entregados" (Estado: llegado o entregado)
```
Pedido #12345
────────────────────────────────────
✅ Entrega completada
```

---

## 👤 DASHBOARD CLIENTE
**Ubicación:** `http://localhost:3000/dashboard/cliente.html`

### Tu Pedido #12345
```
Estado: 📋 Listo
────────────────────────────────────
Restaurante: La Pizzería Italiana
Dirección: Calle Principal 123, Lima
────────────────────────────────────

[📍 Ver Rastreo]
```

#### Modal de Rastreo (Color Dinámico)
```
┌─────────────────────────────────────┐
│ Rastreo de Pedido #12345            │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 📋 Listo (Estado Actual)      │  │
│  │ Rojo | Listo para recoger    │  │
│  └───────────────────────────────┘  │
│                                     │
│  Estado         Hora                │
│  ─────────────────────────────────  │
│  ✓ Recibido     12:30 PM            │
│  ✓ Aceptado     12:35 PM            │
│  ✓ Preparando   12:40 PM            │
│  ◐ Listo        12:50 PM (Actual)   │
│  ○ En Camino    --:-- --            │
│  ○ Llegado      --:-- --            │
│  ○ Entregado    --:-- --            │
│                                     │
└─────────────────────────────────────┘
```

**Colores por Estado:**
- 🔵 `recibido` → Azul (Pedido recibido)
- 🟢 `aceptado` → Verde (Aceptado por restaurante)
- 🟠 `preparando` → Naranja (Preparando comida)
- 🔴 `listo` → Rojo (Listo para recoger)
- 🟣 `en_camino` → Púrpura (En camino)
- ⚫ `llegado` → Gris (Llegado al destino)
- ⬛ `entregado` → Negro (Entregado)
- 🔴 `cancelado` → Rojo (Cancelado)

---

## 🔐 AUTENTICACIÓN SEGURA

### Login Restaurante
```
Email: bitewit901@bialode.com
Contraseña: 123456
```
✅ Se guarda en `authManager.currentUser`
✅ Se usa para validar cambios de estado
✅ Se limpia al logout

### Login Repartidor
```
Email: tixid50387@bialode.com
Contraseña: (debe tener una)
```

### Login Cliente
```
Email: verihi7963@badfist.com
Contraseña: 123456
```

---

## 📱 CÓMO USAR

### 1️⃣ COMO RESTAURANTE (Publicar Productos)

```
1. Abre: http://localhost:3000/dashboard/restaurante.html
2. Log in con: bitewit901@bialode.com / 123456
3. Click en tab: "📦 Mis Productos"
4. Sigue la interfaz para agregar:
   - Nombre del producto
   - Descripción
   - Precio base
   - Categoría
   - Imagen URL
   - Tamaños y variantes
5. Click "Guardar Producto"
```

✅ Tus productos aparecen en `restaurantes.html` para clientes

---

### 2️⃣ COMO CLIENTE (Crear Pedido)

```
1. Abre: http://localhost:3000
2. Haz click en un restaurante
3. Selecciona productos + tamaño
4. Agrega al carrito
5. Click "Ir a Checkout"
6. Completa datos de entrega
7. Click "Hacer Pedido"
```

✅ Pedido llega al restaurante como "recibido"

---

### 3️⃣ COMO RESTAURANTE (Procesar Pedido)

```
1. Tab "📥 Nuevos" (recibido) - VES el pedido
2. Click "✅ Aceptar" → Estado: aceptado
3. Tab "✅ Aceptados" - VES el pedido
4. Click "👨‍🍳 Preparando" → Estado: preparando
5. Tab "👨‍🍳 Preparando" - VES el pedido
6. Click "📋 Listo" → Estado: listo (para repartidor)
```

---

### 4️⃣ COMO REPARTIDOR (Entregar Pedido)

```
1. Abre: http://localhost:3000/dashboard/repartidor.html
2. Log in con tu email de repartidor
3. Tab "📥 Disponibles" (listo) - VES los pedidos
4. Click "🚴 Recoger" → Estado: en_camino
5. Tab "🚴 En Viaje" - VES el pedido en ruta
6. Click "🏁 Llegar" → Estado: llegado
```

---

### 5️⃣ COMO CLIENTE (Confirmar Entrega)

```
1. Tab "Mis Pedidos" - VES estado: "llegado"
2. Modal de Rastreo muestra progreso
3. Opción: "Confirmar Entrega" → Estado: entregado
```

---

## 🗄️ ESTADOS DE LA BASE DE DATOS

| Estado | Fase | Control | Siguiente |
|--------|------|---------|-----------|
| `recibido` | Pedido nuevo | Restaurante: Aceptar/Rechazar | aceptado/cancelado |
| `aceptado` | Confirmado | Restaurante: Preparando | preparando |
| `preparando` | Cocinando | Restaurante: Listo | listo |
| `listo` | Esperando repartidor | Repartidor: Recoger | en_camino |
| `en_camino` | En tránsito | Repartidor: Llegar | llegado |
| `llegado` | En destino | Cliente: Confirmar | entregado |
| `entregado` | ✅ Completo | Sistema | (fin) |
| `cancelado` | ❌ Rechazado | (fin) | (sin retorno) |

---

## 🛠️ ENDPOINTS API

### Cambiar Estado de Pedido
```
PUT /api/orders/{orderId}/status
Headers: {
  Authorization: Bearer {token},
  Content-Type: application/json
}
Body: {
  estado: "aceptado|preparando|listo|en_camino|llegado|entregado|cancelado"
}
```

**Validación:**
- ✅ Solo restaurante puede cambiar: recibido → aceptado/cancelado/preparando/listo
- ✅ Solo repartidor puede cambiar: listo → en_camino/llegado
- ✅ Solo cliente puede cambiar: llegado → entregado
- ✅ Se valida automáticamente el rol del usuario

---

## 🔍 CÓMO VERIFICAR QUE FUNCIONA

### En la consola del navegador (F12):
```javascript
// Ver usuario actual
window.authManager.getCurrentUser()

// Ver token
localStorage.getItem('supabaseAuthToken')

// Ver carrito
window.cart.getItems()
```

### En los logs del servidor:
```
📝 Actualizando pedido 123e4567-e89b-12d3-a456-426614174000 de "aceptado" → "preparando"
✅ Pedido 123e4567-e89b-12d3-a456-426614174000 actualizado a: preparando
```

---

## ⚠️ ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| "restaurantId undefined" | sessionStorage borrado | Usa authManager.getCurrentUser() |
| "No autorizado: restaurantId no coincide" | Token expirado | Haz login nuevamente |
| "Estado no válido" | Typo en estado | Usa: aceptado, preparando, listo, etc. |
| "Pedido no encontrado" | ID pedido incorrecto | Verifica en logs del servidor |
| "No autenticado" | Sin token | Revisa localStorage |

---

## ✅ CHECKLIST FINAL

- [x] Autenticación segura con JWT
- [x] Restaurante puede aceptar/rechazar pedidos
- [x] Restaurante puede cambiar estado a preparando → listo
- [x] Repartidor ve solo pedidos "listo"
- [x] Repartidor puede cambiar a en_camino → llegado
- [x] Cliente ve rastreo con colores dinámicos
- [x] Base de datos registra historial en pedido_rastreo
- [x] localStorage persiste sesión
- [x] sessionStorage limpiado en logout
- [x] Botones contextuales según rol y estado

---

## 🎊 ¡LISTO PARA PRODUCCIÓN!

Ahora puedes hacer un flujo completo desde cero:
1. Crea cuenta restaurante
2. Publica productos
3. Crea cuenta cliente
4. Haz un pedido
5. Acepta en restaurante
6. Marca como preparando → listo
7. Crea cuenta repartidor
8. Recoge pedido → en camino → llegado
9. Cliente confirma entrega

¡El sistema es completamente funcional! 🚀
