// authManager.js - VERSIÓN CORREGIDA PARA NUEVO BACKEND
console.log('📦 Cargando authManager.js...');

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.initPromise = this.init();
    }

    async init() {
        console.log('🔄 AuthManager inicializando...');
        
        // ✅ CARGAR desde storage PRIMERO
        this.loadFromStorage();
        
        console.log('🔍 Estado inicial:', {
            hasToken: !!this.token,
            hasUser: !!this.currentUser,
            isLoggedIn: this.isLoggedIn(),
            tokenLength: this.token?.length
        });
        
        // ✅ SI YA HAY USUARIO LOGUEADO EN STORAGE, NO VERIFICAR TOKEN
        if (this.isLoggedIn()) {
            console.log('✅ Usuario ya logueado en storage - usando datos guardados');
            this.updateGlobalUI();
            return;
        }
        
        // ✅ SOLO VERIFICAR SI NO HAY DATOS GUARDADOS Y HAY TOKEN
        if (this.token && this.isValidToken(this.token)) {
            try {
                console.log('🔐 Intentando verificar token con servidor...');
                await this.verifyToken();
            } catch (error) {
                console.warn('⚠️ Verificación de token falló (esperado si está expirado):', error.message);
                this.clearAuth();
            }
        } else if (this.token && !this.isValidToken(this.token)) {
            console.warn('⚠️ Token inválido en storage - limpiando');
            this.clearAuth();
        }
        
        // ✅ ACTUALIZAR UI SIEMPRE
        this.updateGlobalUI();
        console.log('✅ AuthManager inicializado');
    }

    // ✅ VALIDAR FORMATO DEL TOKEN
    isValidToken(token) {
        if (!token || token === 'null' || token === 'undefined') {
            return false;
        }
        
        const tokenParts = token.split('.');
        return tokenParts.length === 3;
    }

    // ✅ ESPERAR A QUE authManager ESTÉ LISTO
    async isReady() {
        console.log('⏳ Esperando a que AuthManager esté listo...');
        await this.initPromise;
        console.log('✅ AuthManager listo');
        return true;
    }

    // ✅ VERSIÓN CORREGIDA - No cierra sesión innecesariamente
    loadFromStorage() {
        try {
            const savedUser = localStorage.getItem('currentUser');
            const savedToken = localStorage.getItem('supabaseAuthToken');
            
            console.log('📦 Cargando desde storage:', {
                savedUser: !!savedUser,
                savedToken: !!savedToken,
                tokenLength: savedToken?.length
            });
            
            // ✅ CRÍTICO: PRIMERO configurar el token en rapiRushAPI
            if (savedToken && this.isValidToken(savedToken)) {
                this.token = savedToken;
                console.log('🔐 Token cargado - Longitud:', this.token.length);
                
                // ✅ CONFIGURAR TOKEN INMEDIATAMENTE en rapiRushAPI
                if (window.rapiRushAPI && typeof window.rapiRushAPI.setToken === 'function') {
                    window.rapiRushAPI.setToken(this.token);
                    console.log('✅ Token configurado en rapiRushAPI');
                }
                
                // ✅ LUEGO cargar usuario
                if (savedUser) {
                    try {
                        this.currentUser = JSON.parse(savedUser);
                        // ✅ FORZAR loggedIn a true cuando tenemos token válido
                        this.loggedIn = true;
                        this.currentUser.loggedIn = true;
                        
                        // ✅ GUARDAR INMEDIATAMENTE con loggedIn = true
                        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                        console.log('👤 Usuario cargado y persistido:', this.currentUser?.email);
                        console.log('✅ loggedIn guardado en localStorage');
                    } catch (e) {
                        console.warn('⚠️ Error parseando usuario:', e);
                        this.currentUser = null;
                        this.loggedIn = false;
                    }
                }
            } else {
                console.log('⚠️ Sin token válido, limpiando sesión');
                this.clearAuth();
            }
        } catch (error) {
            console.warn('❌ Error cargando desde storage:', error);
        }
    }

    // ✅ VERIFICAR TOKEN
    async verifyToken() {
        try {
            console.log('🔐 Verificando token...');
            
            if (!this.token || !this.isValidToken(this.token)) {
                console.warn('❌ No hay token válido para verificar');
                this.clearAuth();
                return false;
            }

            if (!window.rapiRushAPI || typeof window.rapiRushAPI.getCurrentUser !== 'function') {
                console.error('❌ rapiRushAPI.getCurrentUser no disponible');
                return false;
            }

            console.log('🔐 Llamando a getCurrentUser...');
            const userData = await window.rapiRushAPI.getCurrentUser();
            
            if (userData && userData.user) {
                console.log('✅ Token verificado:', userData.user.email);
                await this.syncUserData(userData);
                return true;
            } else {
                throw new Error('Token inválido - respuesta vacía');
            }
        } catch (error) {
            console.warn('❌ Error verificando token:', error);
            this.clearAuth();
            return false;
        }
    }

    async syncUserData(apiData) {
        const userData = apiData.user || apiData;
        
        // ✅ CORRECCIÓN: Usar los campos correctos del nuevo backend
        this.currentUser = {
            id: userData.id || userData.usuario_id,                   // ✅ Compatibilidad con ambos
            usuario_id: userData.usuario_id || userData.id,           // ✅ Nuevo campo
            restaurante_id: userData.restaurante_id || null,          // ✅ ID del restaurante si aplica
            repartidor_id: userData.repartidor_id || null,            // ✅ ID del repartidor si aplica
            cliente_id: userData.cliente_id || null,                  // ✅ ID del cliente si aplica
            nombre: userData.nombre || userData.nombres || userData.cliente_nombre || userData.restaurante_nombre || userData.repartidor_nombre || userData.email.split('@')[0],
            name: userData.nombre || userData.nombres || userData.cliente_nombre || userData.restaurante_nombre || userData.repartidor_nombre || userData.email.split('@')[0],
            email: userData.email,
            role: userData.rol || userData.role || 'cliente',         // ✅ Compatibilidad
            rol: userData.rol || userData.role || 'cliente',          // ✅ Campo principal
            phone: userData.telefono || userData.cliente_telefono || userData.restaurante_telefono || userData.repartidor_telefono || '',
            address: userData.direccion || userData.cliente_direccion || userData.restaurante_direccion || '',
            loggedIn: true,
            loginTime: new Date().toISOString()
        };

        console.log('💾 Sincronizando datos del usuario:', {
            usuario_id: this.currentUser.usuario_id,
            restaurante_id: this.currentUser.restaurante_id,
            repartidor_id: this.currentUser.repartidor_id,
            cliente_id: this.currentUser.cliente_id,
            name: this.currentUser.name,
            role: this.currentUser.role
        });

        this.saveToStorage();
        return this.currentUser;
    }

    saveToStorage() {
        try {
            if (this.currentUser) {
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                localStorage.setItem('usuario_id', this.currentUser.usuario_id || this.currentUser.id);
                localStorage.setItem('user_name', this.currentUser.nombre || this.currentUser.name);
                localStorage.setItem('user_role', this.currentUser.rol || this.currentUser.role);
                
                // ✅ Guardar IDs específicos si existen
                if (this.currentUser.restaurante_id) {
                    localStorage.setItem('restaurante_id', this.currentUser.restaurante_id);
                }
                if (this.currentUser.repartidor_id) {
                    localStorage.setItem('repartidor_id', this.currentUser.repartidor_id);
                }
                if (this.currentUser.cliente_id) {
                    localStorage.setItem('cliente_id', this.currentUser.cliente_id);
                }
                
                console.log('💾 Usuario guardado en storage');
            }
            
            if (this.token && this.isValidToken(this.token)) {
                localStorage.setItem('supabaseAuthToken', this.token);
                console.log('💾 Token guardado en storage');
            }
        } catch (error) {
            console.warn('Error guardando en storage:', error);
        }
    }

    // ✅ MÉTODO LOGIN CORREGIDO
    async login(email, password, rememberMe = true) {
        try {
            console.log('📤 AuthManager.login() llamado para:', email);
            
            // ✅ USAR EL MÉTODO DE INSTANCIA DE rapiRushAPI
            const result = await window.rapiRushAPI.login(email, password);
            console.log('✅ Login API result recibido:', {success: result.success, hasUser: !!result.user, hasSession: !!result.session});

            if (!result.success || !result.user) {
                console.error('❌ Respuesta de login inválida:', result);
                throw new Error(result.error || 'Credenciales incorrectas');
            }

            // ✅ CONFIGURAR TOKEN
            if (result.session && result.session.access_token) {
                this.token = result.session.access_token;
                window.rapiRushAPI.setToken(this.token);
                localStorage.setItem('supabaseAuthToken', this.token);
                console.log('💾 Token guardado - Longitud:', this.token.length);
            } else {
                throw new Error('No se recibió token de autenticación');
            }

            // ✅ GUARDAR DATOS EN sessionStorage Y localStorage
            sessionStorage.setItem('usuario_id', result.user.usuario_id || result.user.id);
            sessionStorage.setItem('user_email', result.user.email);
            sessionStorage.setItem('user_role', result.user.rol);
            sessionStorage.setItem('user_name', result.user.nombre || result.user.nombres || result.user.cliente_nombre || result.user.restaurante_nombre || result.user.email);
            
            // ✅ TAMBIÉN GUARDAR EN localStorage PARA PERSISTENCIA
            localStorage.setItem('usuario_id', result.user.usuario_id || result.user.id);
            localStorage.setItem('user_email', result.user.email);
            localStorage.setItem('user_role', result.user.rol);
            localStorage.setItem('user_name', result.user.nombre || result.user.nombres || result.user.cliente_nombre || result.user.restaurante_nombre || result.user.email);
            
            // ✅ SINCRONIZAR DATOS DEL USUARIO CON NUEVOS CAMPOS
            await this.syncUserData(result);
            
            // ✅ VERIFICACIÓN FINAL
            console.log('🔍 Verificación final login:', {
                tokenEnAuthManager: !!this.token,
                tokenEnRapiRushAPI: !!window.rapiRushAPI?.token,
                tokenEnLocalStorage: !!localStorage.getItem('supabaseAuthToken'),
                usuario: this.currentUser
            });

            this.updateGlobalUI();
            console.log('✅ Login exitoso');
            return this.currentUser;

        } catch (error) {
            console.error('💥 Error en login:', error);
            throw error;
        }
    }

    // ✅ REGISTRO CLIENTE CORREGIDO
    async register(userData) {
        try {
            console.log('📤 Registrando usuario...');
            
            const result = await RapiRushAPI.registerCliente(userData);

            if (!result || !result.user) {
                throw new Error('Error en el registro');
            }

            // ✅ SOLO guardar token si es válido
            if (result.session && result.session.access_token && result.session.access_token !== 'null') {
                this.token = result.session.access_token;
                window.rapiRushAPI.setToken(this.token);
                localStorage.setItem('supabaseAuthToken', this.token);
                console.log('🔐 Token guardado desde registro');
                
                // ✅ Sincronizar datos si hay token
                await this.syncUserData(result.user);
            } else {
                console.log('⚠️ Sin token válido - usuario debe verificar email');
                // ✅ Guardar info básica sin marcar como loggedIn
                this.currentUser = {
                    usuario_id: result.user.usuario_id,
                    email: result.user.email,
                    name: result.user.cliente_nombre || result.user.email,
                    role: 'cliente',
                    loggedIn: false
                };
                this.saveToStorage();
            }
            
            this.updateGlobalUI();
            console.log('✅ Registro exitoso');

            return this.currentUser;

        } catch (error) {
            console.error('💥 Error en registro:', error);
            throw error;
        }
    }

    // ✅ REGISTRO RESTAURANTE CORREGIDO
    async registerRestaurante(userData) {
        try {
            console.log('📤 Registrando restaurante...');
            
            const result = await RapiRushAPI.registerRestaurante(userData);

            if (!result || !result.user) {
                throw new Error('Error en el registro del restaurante');
            }

            if (result.session && result.session.access_token) {
                this.token = result.session.access_token;
                window.rapiRushAPI.setToken(this.token);
                localStorage.setItem('supabaseAuthToken', this.token);
            }

            await this.syncUserData(result.user);
            
            this.updateGlobalUI();
            console.log('✅ Registro de restaurante exitoso');

            return this.currentUser;

        } catch (error) {
            console.error('💥 Error en registro de restaurante:', error);
            throw error;
        }
    }

    // ✅ REGISTRO REPARTIDOR CORREGIDO
    async registerRepartidor(userData) {
        try {
            console.log('📤 Registrando repartidor...');
            
            const result = await RapiRushAPI.registerRepartidor(userData);

            if (!result || !result.user) {
                throw new Error('Error en el registro del repartidor');
            }

            if (result.session && result.session.access_token) {
                this.token = result.session.access_token;
                window.rapiRushAPI.setToken(this.token);
                localStorage.setItem('supabaseAuthToken', this.token);
            }

            await this.syncUserData(result.user);
            
            this.updateGlobalUI();
            console.log('✅ Registro de repartidor exitoso');

            return this.currentUser;

        } catch (error) {
            console.error('💥 Error en registro de repartidor:', error);
            throw error;
        }
    }

    // ✅ LOGOUT (igual, está bien)
    async logout() {
        try {
            this.clearAuth();
            
            if (this.token) {
                try {
                    await window.rapiRushAPI.logout();
                } catch (error) {
                    console.warn('⚠️ Error en logout API (continuando):', error);
                }
            }
            
            this.showLogoutToast();
            
            setTimeout(() => {
                // ✅ Redirigir al login en lugar del home
                const currentPath = window.location.pathname;
                if (currentPath.includes('/dashboard/')) {
                    window.location.href = '../auth/login.html';
                } else if (currentPath.includes('/auth/')) {
                    window.location.href = 'login.html';
                } else {
                    window.location.href = 'auth/login.html';
                }
            }, 500);
            
        } catch (error) {
            console.error('❌ Error crítico en logout:', error);
            this.clearAuth();
            // ✅ También redirigir al login en caso de error
            const currentPath = window.location.pathname;
            if (currentPath.includes('/dashboard/')) {
                window.location.href = '../auth/login.html';
            } else {
                window.location.href = 'auth/login.html';
            }
        }
    }

    clearAuth() {
        console.log('🧹 Limpiando autenticación...');
        this.currentUser = null;
        this.token = null;
        
        localStorage.removeItem('currentUser');
        localStorage.removeItem('supabaseAuthToken');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('usuario_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        localStorage.removeItem('restaurante_id');
        localStorage.removeItem('repartidor_id');
        localStorage.removeItem('cliente_id');
        sessionStorage.clear();
        
        if (window.rapiRushAPI && typeof window.rapiRushAPI.clearToken === 'function') {
            window.rapiRushAPI.clearToken();
        }
        
        if (window.cart && typeof window.cart.clearCart === 'function') {
            window.cart.clearCart();
        }
        
        this.updateGlobalUI();
        console.log('✅ Autenticación limpiada');
    }

    // ✅ RESTANTE DEL CÓDIGO IGUAL (está bien)
    getDashboardUrl() {
        const role = this.currentUser?.role || 'cliente';
        const currentPath = window.location.pathname;
        
        console.log('📍 Calculando dashboard desde:', currentPath);
        
        const routes = {
            'cliente': 'cliente.html',
            'restaurante': 'restaurante.html', 
            'repartidor': 'repartidor.html',
            'admin': 'admin.html'
        };
        
        const fileName = routes[role] || 'cliente.html';
        
        if (currentPath.includes('/dashboard/')) {
            return fileName;
        } else if (currentPath.includes('/auth/')) {
            return `../dashboard/${fileName}`;
        } else {
            return `dashboard/${fileName}`;
        }
    }

    getHomeUrl() {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/dashboard/')) {
            return '../index.html';
        } else if (currentPath.includes('/auth/')) {
            return '../index.html';
        } else {
            return 'index.html';
        }
    }

    ensureAuthenticated() {
        if (!this.isLoggedIn()) {
            console.warn('🔐 Sesión no válida, redirigiendo al login');
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'auth/login.html';
            return false;
        }
        return true;
    }

    updateGlobalUI() {
        this.updateNavbar();
        this.updateDropdownMenu();
        this.updateUserInfo();
    }

    updateNavbar() {
        if (this.isLoggedIn()) {
            document.querySelectorAll('.auth-state.logged-in').forEach(el => {
                el.style.display = 'block';
            });
            document.querySelectorAll('.auth-state.logged-out').forEach(el => {
                el.style.display = 'none';
            });
            
            const simpleNavUser = document.querySelector('#nav-username');
            if (simpleNavUser) {
                simpleNavUser.textContent = this.currentUser.name;
                this.updateSimpleNavbarLinks();
            }
            
            document.querySelectorAll('#nav-username-logged, .user-name, #userName').forEach(el => {
                if (el) el.textContent = this.currentUser.name;
            });
            
        } else {
            document.querySelectorAll('.auth-state.logged-out').forEach(el => {
                el.style.display = 'block';
            });
            document.querySelectorAll('.auth-state.logged-in').forEach(el => {
                el.style.display = 'none';
            });
            
            const simpleNavUser = document.querySelector('#nav-username');
            if (simpleNavUser) {
                simpleNavUser.textContent = 'Hola';
                this.restoreSimpleNavbarLinks();
            }
        }
    }

    updateSimpleNavbarLinks() {
        const dropdownMenu = document.querySelector('.navbar-nav .dropdown-menu');
        if (!dropdownMenu) return;
        
        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="${this.getDashboardUrl()}">Mi cuenta</a></li>
            <li><a class="dropdown-item" href="#" onclick="globalLogout()">Cerrar sesión</a></li>
        `;
    }

    restoreSimpleNavbarLinks() {
        const dropdownMenu = document.querySelector('.navbar-nav .dropdown-menu');
        if (!dropdownMenu) return;
        
        const currentPath = window.location.pathname;
        let authPath = 'auth/';
        
        if (currentPath.includes('/auth/')) {
            authPath = '';
        } else if (currentPath.includes('/dashboard/')) {
            authPath = '../auth/';
        }
        
        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="${authPath}login.html">Ingresar</a></li>
            <li><a class="dropdown-item" href="${authPath}register.html">Registrarse</a></li>
        `;
    }

    updateDropdownMenu() {
        if (this.isLoggedIn()) {
            const dashboardLinks = document.querySelectorAll('#dashboard-link, #user-dashboard-link');
            dashboardLinks.forEach(link => {
                if (link) {
                    link.href = this.getDashboardUrl();
                    link.innerHTML = `<i class="bi bi-person-circle"></i> Mi Cuenta (${this.currentUser.role})`;
                }
            });
        }
    }

    updateUserInfo() {
        if (!this.isLoggedIn()) return;
        
        const elements = {
            'userName': this.currentUser.name,
            'userEmail': this.currentUser.email,
            'nav-username': this.currentUser.name,
            'userNameSidebar': this.currentUser.name
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
    }

    isLoggedIn() {
        // ✅ VERIFICACIÓN COMPLETA
        const hasUser = this.currentUser !== null;
        const hasLoggedInFlag = this.currentUser?.loggedIn === true;
        const hasToken = this.token && this.isValidToken(this.token);
        
        const result = hasUser && hasLoggedInFlag && hasToken;
        
        console.log('🔍 isLoggedIn() check:', {
            currentUser: hasUser,
            loggedIn: this.currentUser?.loggedIn,
            hasToken: hasToken,
            result: result,
            email: this.currentUser?.email
        });
        return result;
    }

    async isReady() {
        await this.initPromise;
        return true;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    showLogoutToast() {
        console.log('👋 Sesión cerrada');
        
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-white bg-success border-0 position-fixed top-50 start-50 translate-middle';
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    Sesión cerrada correctamente
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 1500);
    }

    getAuthHeaders() {
        if (this.token && this.isValidToken(this.token)) {
            return {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            };
        }
        return {
            'Content-Type': 'application/json'
        };
    }
}

// Instancia global única
window.authManager = new AuthManager();

console.log('✅ authManager.js cargado. window.authManager:', !!window.authManager);

// Función global para logout
window.globalLogout = () => window.authManager.logout();

// ✅ FUNCIÓN DE DIAGNÓSTICO GLOBAL
window.debugAuth = () => {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 DIAGNÓSTICO DE AUTENTICACIÓN');
    console.log('='.repeat(60));
    
    const auth = window.authManager;
    const localUser = localStorage.getItem('currentUser');
    const localToken = localStorage.getItem('supabaseAuthToken');
    
    console.log('📦 authManager.currentUser:', auth.currentUser);
    console.log('🔐 authManager.token (primeros 20 chars):', auth.token?.substring(0, 20) + '...');
    console.log('📝 localStorage.currentUser:', localUser ? JSON.parse(localUser) : null);
    console.log('📝 localStorage.token (primeros 20 chars):', localToken?.substring(0, 20) + '...');
    console.log('✅ isLoggedIn():', auth.isLoggedIn());
    console.log('✅ isValidToken():', auth.isValidToken(auth.token));
    console.log('\n💡 Pasos a seguir:');
    console.log('   1. Si isLoggedIn() = false, el problema es currentUser.loggedIn');
    console.log('   2. Si hay token pero isValidToken() = false, regenerar token');
    console.log('   3. Si localStorage está vacío, la sesión fue limpiada');
    console.log('='.repeat(60) + '\n');
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.authManager.updateGlobalUI();
    }, 100);
});