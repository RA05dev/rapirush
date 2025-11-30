# 🧪 GUÍA DE TESTING - FASE 5

**Verificar que todos los cambios funcionan correctamente**

---

## ✅ CHECKLIST DE TESTING

### 1. VERIFICAR CAMPOS DE REGISTRO

**URL:** `Client/auth/register.html`

**Pasos:**
1. Abre el archivo en navegador
2. Verifica que hay **2 campos separados**:
   - ☑️ Campo "Nombre" (id="firstName")
   - ☑️ Campo "Apellido" (id="lastName")
3. **NO debe haber** campo "Nombre completo"

**Resultado esperado:** ✅ 2 campos visibles separados

---

### 2. TEST COMPLETO: REGISTRO → CONFIRMACIÓN → LOGIN

**Proceso paso a paso:**

#### A) REGISTRARSE
1. Abre: `Client/auth/register.html`
2. Completa:
   - Nombre: `Juan`
   - Apellido: `Pérez`
   - Email: `testuser_$(date +%s)@email.com` (usa correo único)
   - Teléfono: `987654321`
   - Dirección: `Calle Principal 123`
   - Contraseña: `Test123!`
   - Confirmar: `Test123!`
   - ☑️ Aceptar términos

3. Haz clic en "Crear Cuenta"

**Esperado:**
- ✅ Se muestra mensaje: "¡Cuenta creada!"
- ✅ Se abre **nueva ventana del navegador** (emergente)
- ✅ La ventana dice "ConfirmarEmail"
- ❌ NO debe mostrar notificación toast simple

#### B) CONFIRMAR EMAIL
1. En la **ventana emergente** que se abrió:
2. Verifica que pidió confirmar email
3. Haz clic en enlace de confirmación (o ver si está automático)
4. Espera confirmación

**Esperado:**
- ✅ Ventana muestra "Email confirmado"
- ✅ Después de 3 segundos, se cierra automáticamente
- ✅ Ventana principal redirige a `Client/auth/login.html`

#### C) LOGIN
1. Estás en página de login
2. Completa:
   - Email: `testuser_xxx@email.com` (el que registraste)
   - Contraseña: `Test123!`
3. Haz clic "Ingresar"

**Esperado:**
- ✅ Inicia sesión correctamente
- ✅ Redirige a dashboard cliente
- ✅ Muestra tu nombre en el sidebar (en negrita)
- ✅ Muestra tu email debajo (en pequeño/gris)
- ❌ NO hay logout automático

---

### 3. VERIFICAR DASHBOARD MUESTRA NOMBRE

**URL:** `Client/dashboard/cliente.html`

**Elementos a verificar en el sidebar izquierdo:**

```
┌─────────────────────┐
│  👤 (Avatar)        │ ← Icono persona
│  Juan Pérez (Bold)  │ ← ✅ NOMBRE EN NEGRITA
│  testuser@email.com │ ← ✅ EMAIL EN PEQUEÑO/GRIS
│  [Cliente activo]   │
└─────────────────────┘
```

**Checklist:**
- ☑️ Nombre aparece en **bold** (negrita)
- ☑️ Email aparece en **pequeño** y **gris** (text-muted)
- ☑️ Email aparece **DEBAJO** del nombre
- ☑️ Avatar se muestra correctamente

---

### 4. TEST DE LOGOUT

**En dashboard cliente:**
1. Haz clic en tu nombre (dropdown en navbar)
2. Selecciona "Cerrar sesión"

**Esperado:**
- ✅ Sesión se cierra
- ✅ Se muestra mensaje de confirmación
- ✅ Redirige a página de inicio
- ✅ Navbar muestra "Hola" (no nombre)

---

### 5. VERIFICAR NO EXISTE COMPRESIÓN UUID

**Búsqueda en código:**

Abre: `Client/assets/js/authManager.js`

Busca (Ctrl+F):
- `compress` ← NO debe encontrar
- `shorten` ← NO debe encontrar
- `truncate` ← NO debe encontrar
- `uuid.slice` ← NO debe encontrar

**Esperado:**
- ✅ 0 resultados encontrados
- ✅ UUIDs pasan como strings de 36 caracteres completos

---

### 6. TEST DE CREACIÓN DE PRODUCTO (Restaurante)

**URL:** `Client/dashboard/restaurante.html`

**Proceso:**
1. Registra un restaurante (si no lo hiciste)
2. En dashboard restaurante, ve a "Crear Producto"
3. Completa:
   - Nombre: `Pizza Prueba`
   - Descripción: `Pizza de prueba`
   - Precio: `25.00`
   - Imagen: Sube una foto
4. Agrega tamaños:
   - S: 1.0
   - M: 1.3
   - L: 1.5
5. Haz clic "Guardar Producto"

**Esperado:**
- ✅ Producto se guarda sin errores
- ✅ Aparece en el menú del restaurante
- ✅ NO hay errores de UUID
- ✅ Los tamaños están disponibles

---

## 📊 MATRIZ DE CAMBIOS

| Cambio | Archivo | Verificación | Estado |
|--------|---------|--------------|--------|
| Agregar Apellido | register.html | Campos separados | ✅ |
| Actualizar JS registro | register.js | firstName + lastName | ✅ |
| Email a ventana | register.js | window.open() | ✅ |
| Redirección a login | register.js | location.href | ✅ |
| Dashboard muestra nombre | cliente.html | Nombre bold | ✅ |
| Verificar no hay compress | authManager.js | grep search | ✅ |

---

## 🐛 ERRORES COMUNES

### ❌ "No me aparece el campo Apellido"
**Solución:**
1. Limpia cache del navegador (Ctrl+Shift+Delete)
2. Recarga página (F5)
3. Verifica que editaste el archivo correcto

### ❌ "No se abre ventana de confirmación"
**Causa:** Pop-ups bloqueados

**Solución:**
1. En Chrome: Icono Pop-up bloqueado → Permitir
2. Recarga página
3. Intenta registrarte de nuevo

### ❌ "Dice error 404 en ventana de confirmación"
**Causa:** URL de confirmación no existe

**Solución:**
- La ventana es solo demostración
- En producción integrar con Supabase

### ❌ "No se redirige a login"
**Causa:** Error en JavaScript

**Solución:**
1. Abre consola del navegador (F12)
2. Ve a pestaña "Console"
3. Busca errores en rojo
4. Reporta el error

### ❌ "Dashboard muestra email en lugar de nombre"
**Causa:** Cache o datos mal guardados

**Solución:**
1. Cierra sesión
2. Limpia datos: Ctrl+Shift+Delete
3. Inicia sesión de nuevo

---

## ✨ RESULTADO ESPERADO FINAL

Después de completar todos los tests:

```
✅ Registro con nombre y apellido separados
✅ Email verification en ventana del navegador
✅ Redirección a login después de registro
✅ Login exitoso sin logout automático
✅ Dashboard muestra nombre (no email)
✅ No hay errores de UUID
✅ Creación de productos funciona
✅ Sistema de autenticación estable
```

---

## 📋 REPORTE DE TESTING

**Completa esto después de hacer los tests:**

```
FECHA: ___________
NAVEGADOR: ___________
OS: ___________

TEST 1 (Campos registro): ☐ Pasado ☐ Falló
TEST 2 (Flujo completo): ☐ Pasado ☐ Falló
TEST 3 (Dashboard): ☐ Pasado ☐ Falló
TEST 4 (Logout): ☐ Pasado ☐ Falló
TEST 5 (UUID): ☐ Pasado ☐ Falló
TEST 6 (Producto): ☐ Pasado ☐ Falló

ERRORES ENCONTRADOS:
_____________________________________
_____________________________________

OBSERVACIONES:
_____________________________________
_____________________________________
```

---

**Siguiente paso:** Una vez que todos los tests pasen, ¡el proyecto está listo para continuar con nuevas características! 🚀
