# 🔧 GUÍA DE DEBUGGING - PROBLEMA DE SESIÓN CLIENTE

**Problema reportado:**
- Cliente se desloguea automáticamente al acceder al dashboard
- Cuando vuelve al index y reintenta entrar, lo redirige a login
- Admin no tiene este problema
- La sesión no se mantiene al navegar

---

## ✅ CAMBIOS REALIZADOS

### 1. **loadFromStorage() - ARREGLADO** 
**Archivo:** `Client/assets/js/authManager.js` (líneas 55-94)

**Cambio:**
```javascript
// ANTES: No establecía loggedIn: true después de cargar
if (savedUser) {
    this.currentUser = JSON.parse(savedUser);
}

// DESPUÉS: Ahora establece loggedIn: true si hay token válido
if (savedUser) {
    this.currentUser = JSON.parse(savedUser);
    
    // ✅ ASEGURAR que loggedIn esté establecido si hay usuario Y token
    if (savedToken && this.isValidToken(savedToken)) {
        this.currentUser.loggedIn = true;
        console.log('✅ Marcado como loggedIn (token válido)');
    }
}

// También limpia usuario si token es inválido
else if (savedToken && !this.isValidToken(savedToken)) {
    this.currentUser = null; // ✅ NUEVO
}
```

**Impacto:** La sesión ahora se reconoce correctamente al recargar la página

---

### 2. **isLoggedIn() - MEJORADO PARA DEBUGGING**
**Archivo:** `Client/assets/js/authManager.js` (líneas 565-572)

**Cambio:**
```javascript
// ANTES: Sin logs
isLoggedIn() {
    return this.currentUser !== null && this.currentUser.loggedIn === true;
}

// DESPUÉS: Con logs para debugging
isLoggedIn() {
    const result = this.currentUser !== null && this.currentUser.loggedIn === true;
    console.log('🔍 isLoggedIn() check:', {
        currentUser: !!this.currentUser,
        loggedIn: this.currentUser?.loggedIn,
        result: result
    });
    return result;
}
```

**Impacto:** Puedes ver exactamente qué está fallando en la consola

---

### 3. **window.debugAuth() - HERRAMIENTA NUEVA**
**Archivo:** `Client/assets/js/authManager.js` (líneas 633-660)

**Uso desde consola:**
```javascript
debugAuth()  // Ejecuta en la consola del navegador (F12)
```

**Output:**
```
🔍 DIAGNÓSTICO DE AUTENTICACIÓN
📦 authManager.currentUser: {...}
🔐 authManager.token: (primeros 20 caracteres)...
📝 localStorage.currentUser: {...}
📝 localStorage.token: (primeros 20 caracteres)...
✅ isLoggedIn(): true/false
✅ isValidToken(): true/false
```

**Impacto:** Puedes verificar rápidamente el estado completo de autenticación

---

### 4. **cliente.js - AGREGADO DELAY**
**Archivo:** `Client/assets/js/cliente.js` (líneas 1-50)

**Cambio:**
```javascript
// ANTES: Redirige inmediatamente si no hay sesión
if (!authManager.isLoggedIn()) {
    window.location.href = '../auth/login.html';
    return;
}

// DESPUÉS: Agrega delay de 500ms para que authManager termine de inicializarse
setTimeout(() => {
    if (!window.authManager || !authManager.isLoggedIn()) {
        console.log('🔴 Confirmado: Sin sesión válida. Redirigiendo a login.');
        window.location.href = '../auth/login.html';
    }
}, 500);
```

**Impacto:** Evita redireccionamientos prematuros mientras authManager se inicializa

---

## 🧪 CÓMO DEBUGUEAR

### Paso 1: Haz login como cliente
1. Ve a `http://localhost:3000/Client/auth/login.html`
2. Ingresa credenciales de cliente
3. Deberías entrar al dashboard cliente

### Paso 2: Verifica la sesión DENTRO del dashboard
1. Abre Consola (F12)
2. Ejecuta: `debugAuth()`
3. Deberías ver:
   ```
   📦 authManager.currentUser: {
       id: "uuid",
       email: "usuario@email.com",
       name: "Juan Pérez",
       role: "cliente",
       loggedIn: true,  ← CRÍTICO: debe ser true
       ...
   }
   
   ✅ isLoggedIn(): true
   ✅ isValidToken(): true
   ```

### Paso 3: Sal al index (navega atrás)
1. Haz clic en "Inicio" o en el logo
2. Deberías estar en `http://localhost:3000/Client/index.html`
3. Abre Consola nuevamente

### Paso 4: Verifica la sesión EN EL INDEX
1. Ejecuta: `debugAuth()`
2. El resultado DEBE ser igual al paso 2:
   ```
   ✅ isLoggedIn(): true
   📦 currentUser aún existe
   🔐 token aún está en localStorage
   ```

### Paso 5: Intenta entrar nuevamente al dashboard
1. Haz clic en el avatar en la navbar
2. Selecciona "Mi Cuenta"
3. DEBERÍA entrar directamente al dashboard (SIN redireccionamiento a login)
4. Si no funciona, ejecuta `debugAuth()` para ver qué pasó

---

## 📊 MATRIZ DE DEBUGGING

| Situación | Expected | isLoggedIn() | Acción |
|-----------|----------|--------------|--------|
| Acabo de login | ✅ Dashboard | true | Continua |
| Recargo página en dashboard | ✅ Dashboard | true | Continua |
| Navego a index | ✅ Sigue logueado | true | Continua |
| Vuelvo al dashboard | ✅ Dashboard | true | Continua |
| Hago logout | ❌ Login | false | Normal |

---

## 🔴 SI SIGUE FALLANDO

**Si isLoggedIn() es false cuando debería ser true:**
1. Ejecuta: `localStorage.getItem('currentUser')`
2. Verifica que el objeto incluya `loggedIn: true`
3. Si no lo incluye, el problema es en saveToStorage() (ya arreglado)

**Si el token no aparece:**
1. Ejecuta: `localStorage.getItem('supabaseAuthToken')`
2. Si retorna null, el login no está guardando el token
3. Revisa la consola para ver si hay errores del servidor (401, 500, etc.)

**Si todo se ve bien pero sigue redirigiendo:**
1. Aumenta el delay en cliente.js a 1000ms (1 segundo)
2. Verifica que authManager.isReady() esté completando

---

## 🔗 ARCHIVOS MODIFICADOS

- ✅ `Client/assets/js/authManager.js` (líneas 55-94, 161-190, 565-572, 633-660)
- ✅ `Client/assets/js/cliente.js` (líneas 1-50)

---

## ✨ PRÓXIMO TEST

Ejecuta este flujo completo:
1. Limpia el navegador (Ctrl+Shift+Delete → Cookies y datos)
2. Recarga index.html
3. Haz login
4. Ejecuta debugAuth() → Verifca que todo esté ✅
5. Navega a index
6. Ejecuta debugAuth() → Verifca que siga todo ✅
7. Intenta volver al dashboard → Deberí funcionar

**Si todo ✅, el problema está arreglado.**

---

**¿Problemas? Ejecuta `debugAuth()` y reporta exactamente qué ves en la consola.**
