// authManager.js - VERSIÓN DEFINITIVA SIN DUPLICACIONES
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.init();
    }

    async init() {
        console.log('🔄 AuthManager inicializando...');
        
        // ✅ CARGAR desde storage
        this.loadFromStorage();
        
        console.log('🔍 Estado inicial:', {
            hasToken: !!this.token,
            hasUser: !!this.currentUser,
            tokenLength: this.token?.length
        });
        
        // ✅ VERIFICAR SI HAY TOKEN VÁLIDO
        if (this.token && this.isValidToken(this.token)) {
            try {
                await this.verifyToken();
            } catch (error) {
                console.warn('⚠️ Error en verifyToken:', error);
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

    loadFromStorage() {
        try {
            const savedUser = localStorage.getItem('currentUser');
            const savedToken = localStorage.getItem('supabaseAuthToken');
            
            console.log('📦 Cargando desde storage:', {
                savedUser: !!savedUser,
                savedToken: !!savedToken,
                tokenLength: savedToken?.length
            });
            
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                console.log('👤 Usuario cargado:', this.currentUser?.email);
            }
            
            if (savedToken && this.isValidToken(savedToken)) {
                this.token = savedToken;
                console.log('🔐 Token cargado - Longitud:', this.token.length);
                
                // ✅ CONFIGURAR TOKEN EN rapiRushAPI
                if (window.rapiRushAPI && typeof window.rapiRushAPI.setToken === 'function') {
                    window.rapiRushAPI.setToken(this.token);
                    console.log('✅ Token configurado en rapiRushAPI');
                }
            } else if (savedToken && !this.isValidToken(savedToken)) {
                console.warn('❌ Token inválido en storage:', savedToken);
                localStorage.removeItem('supabaseAuthToken');
            }
            
        } catch (error) {
            console.warn('❌ Error cargando desde storage:', error);
            this.clearAuth();
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
        
        this.currentUser = {
            id: userData.id,
            name: userData.nombres || userData.nombre || userData.email.split('@')[0],
            email: userData.email,
            phone: userData.telefono || '',
            address: userData.direccion || '',
            role: userData.rol || 'cliente',
            loggedIn: true,
            loginTime: new Date().toISOString()
        };

        this.saveToStorage();
        return this.currentUser;
    }

    saveToStorage() {
        try {
            if (this.currentUser) {
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
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

    // ✅ MÉTODO LOGIN ÚNICO Y DEFINITIVO
    async login(email, password, rememberMe = true) {
        try {
            console.log('📤 Iniciando sesión...', email);
            
            // ✅ USAR EL MÉTODO DE INSTANCIA DE rapiRushAPI
            const result = await window.rapiRushAPI.login(email, password);
            console.log('✅ Login API result:', result);

            if (!result || !result.user) {
                throw new Error('Credenciales incorrectas');
            }

            // ✅ CONFIGURAR TOKEN
            if (result.session && result.session.access_token) {
                this.token = result.session.access_token;
                
                // ✅ VERIFICAR SINCRONIZACIÓN CON rapiRushAPI
                if (window.rapiRushAPI.token !== this.token) {
                    console.warn('⚠️ Token no sincronizado, configurando manualmente...');
                    window.rapiRushAPI.setToken(this.token);
                }
                
                localStorage.setItem('supabaseAuthToken', this.token);
                console.log('💾 Token guardado - Longitud:', this.token.length);
            } else {
                throw new Error('No se recibió token de autenticación');
            }

            // ✅ SINCRONIZAR DATOS DEL USUARIO
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

    async register(userData) {
        try {
            console.log('📤 Registrando usuario...');
            
            const result = await RapiRushAPI.registerCliente(userData);

            if (!result || !result.user) {
                throw new Error('Error en el registro');
            }

            if (result.session && result.session.access_token) {
                this.token = result.session.access_token;
                window.rapiRushAPI.setToken(this.token);
            }

            await this.syncUserData(result.user);
            
            this.updateGlobalUI();
            console.log('✅ Registro exitoso');

            return this.currentUser;

        } catch (error) {
            console.error('💥 Error en registro:', error);
            throw error;
        }
    }

    async logout() {
        try {
            if (this.token) {
                await RapiRushAPI.logout();
            }
        } catch (error) {
            console.warn('Error en logout API:', error);
        } finally {
            this.showLogoutToast();
            
            setTimeout(() => {
                this.clearAuth();
                window.location.href = this.getHomeUrl();
            }, 1500);
        }
    }

    clearAuth() {
        console.log('🧹 Limpiando autenticación...');
        this.currentUser = null;
        this.token = null;
        
        localStorage.removeItem('currentUser');
        localStorage.removeItem('supabaseAuthToken');
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

    // ✅ RUTAS RELATIVAS INTELIGENTES
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

    // ✅ NUEVO MÉTODO: Verificar y mantener sesión
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
        return this.currentUser !== null && this.currentUser.loggedIn === true;
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

    // ✅ MÉTODO NUEVO: Obtener headers de autenticación
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

// Función global para logout
window.globalLogout = () => window.authManager.logout();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.authManager.updateGlobalUI();
    }, 100);
});