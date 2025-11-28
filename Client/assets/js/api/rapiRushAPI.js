const API_BASE = 'http://localhost:3000/api';

class RapiRushAPI {
  constructor() {
    this.baseURL = API_BASE;
    this.token = null;
  }

  // ✅ SET TOKEN para requests autenticados
  setToken(token) {
    this.token = token;
    console.log('🔐 Token configurado para API');
  }

  // ✅ CLEAR TOKEN para logout
  clearToken() {
    this.token = null;
    console.log('🔓 Token eliminado');
  }

  // ✅ REQUEST GENERICO con manejo de token
async request(endpoint, options = {}) {
    try {
        // ✅ HEADERS CONFIGURADOS CORRECTAMENTE
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // ✅ AGREGAR TOKEN SI EXISTE - FORMA ROBUSTA
        if (this.token && this.token !== 'null' && this.token.length > 10) {
            headers['Authorization'] = `Bearer ${this.token}`;
            console.log('🔐 Token incluido en request, longitud:', this.token.length);
        } else {
            console.warn('⚠️ No hay token válido para la request');
        }

        const config = {
            headers,
            ...options,
        };

        console.log(`📤 API Request: ${endpoint}`, {
            method: config.method || 'GET',
            hasToken: !!this.token,
            tokenLength: this.token?.length
        });

        const response = await fetch(`${this.baseURL}${endpoint}`, config);
        const data = await response.json();

        console.log(`📥 API Response: ${endpoint}`, {
            status: response.status,
            success: data.success,
            error: data.error
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.log('🔓 Token inválido en respuesta, limpiando...');
                this.clearToken();
                if (window.authManager) {
                    window.authManager.clearAuth();
                }
            }
            throw new Error(data.error || data.message || `Error ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error(`💥 API Error en ${endpoint}:`, error);
        throw error;
    }
}
  // ✅ REGISTRO CLIENTE (desde register.html)
  static async registerCliente(userData) {
    try {
      console.log('📤 Registrando cliente:', userData);

      const response = await fetch(`${API_BASE}/auth/register/cliente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          userData: {
            nombres: userData.fullName,
            telefono: userData.phone,
            direccion: userData.address || ''
          }
        })
      });

      const data = await response.json();
      console.log('📥 Respuesta registro cliente:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }

      return data;

    } catch (error) {
      console.error('💥 Error en registro cliente:', error);
      throw error;
    }
  }

  // ✅ REGISTRO RESTAURANTE (desde agregarestaurante.html)
  static async registerRestaurante(userData) {
    try {
      console.log('📤 Registrando restaurante:', userData);

      const response = await fetch(`${API_BASE}/auth/register/restaurante`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password || 'tempPassword123', // Password temporal
          userData: {
            nombre: userData.nombre,
            telefono: userData.telefono,
            direccion: userData.direccion,
            tipoComida: userData.tipoComida
          }
        })
      });

      const data = await response.json();
      console.log('📥 Respuesta registro restaurante:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro del restaurante');
      }

      return data;

    } catch (error) {
      console.error('💥 Error en registro restaurante:', error);
      throw error;
    }
  }

  // ✅ REGISTRO REPARTIDOR (desde serepartidor.html)
  static async registerRepartidor(userData) {
    try {
      console.log('📤 Registrando repartidor:', userData);

      const response = await fetch(`${API_BASE}/auth/register/repartidor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password || 'tempPassword123', // Password temporal
          userData: {
            nombre: userData.nombre,
            telefono: userData.telefono,
            vehiculo: userData.vehiculo
          }
        })
      });

      const data = await response.json();
      console.log('📥 Respuesta registro repartidor:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro del repartidor');
      }

      return data;

    } catch (error) {
      console.error('💥 Error en registro repartidor:', error);
      throw error;
    }
  }

  // ✅ LOGIN (desde login.html)
  async login(email, password) {
    try {
      console.log('📤 Iniciando login con método de instancia:', email);

      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('📥 Respuesta login:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      // ✅ CONFIGURAR EL TOKEN AUTOMÁTICAMENTE SI EXISTE
      if (data.session && data.session.access_token) {
        this.token = data.session.access_token;
        console.log('🔐 Token configurado automáticamente en instancia - Longitud:', this.token.length);
      }

      return data;

    } catch (error) {
      console.error('💥 Error en login:', error);
      throw error;
    }
  }

  // ✅ MANTENER el método estático para compatibilidad
  static async login(email, password) {
    try {
      console.log('📤 Iniciando login con método estático:', email);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('📥 Respuesta login:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      // ❌ LOS MÉTODOS ESTÁTICOS NO CONFIGURAN EL TOKEN EN LA INSTANCIA
      return data;

    } catch (error) {
      console.error('💥 Error en login:', error);
      throw error;
    }
  }




  // ✅ LOGOUT
  static async logout() {
    try {
      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  // ✅ OBTENER PERFIL (requiere autenticación)
  static async getProfile(token) {
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error obteniendo perfil');
      }

      return data;

    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  }

  // ✅ VERIFICAR TOKEN
  static async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Error verificando token:', error);
      throw error;
    }
  }

  // ✅ OBTENER INFORMACIÓN DEL USUARIO ACTUAL
  async getCurrentUser() {
    try {
      if (!this.token) {
        throw new Error('No hay token disponible');
      }

      console.log('🔐 Obteniendo usuario actual con token:', this.token);
      
      const response = await fetch(`${this.baseURL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log('📥 Respuesta usuario actual:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error obteniendo usuario actual');
      }

      return data;

    } catch (error) {
      console.error('❌ Error obteniendo usuario actual:', error);
      throw error;
    }
  }

  // ✅ MANTENER el método estático para compatibilidad
  static async getCurrentUser(token) {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error obteniendo usuario actual');
      }

      return data;

    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      throw error;
    }
  }

  // ✅ MÉTODOS PARA PEDIDOS
  async createOrder(orderData) {
    try {
      console.log('📦 Creando pedido en servidor...', orderData);
      
      const response = await fetch(`${this.baseURL}/orders/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('📥 Respuesta crear pedido:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error creando pedido');
      }

      return data;

    } catch (error) {
      console.error('❌ Error creando pedido:', error);
      throw error;
    }
  }

  async getMyOrders() {
    try {
      console.log('📋 Obteniendo pedidos del usuario...');
      
      const response = await fetch(`${this.baseURL}/orders/my-orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log('📥 Respuesta pedidos:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error obteniendo pedidos');
      }

      return data;

    } catch (error) {
      console.error('❌ Error obteniendo pedidos:', error);
      throw error;
    }
  }

  // ✅ REENVIAR EMAIL DE VERIFICACIÓN
  static async resendVerification(token) {
    try {
      const response = await fetch(`${API_BASE}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error reenviando verificación');
      }

      return data;

    } catch (error) {
      console.error('Error reenviando verificación:', error);
      throw error;
    }
  }

  // ✅ MÉTODO COMPATIBILIDAD (para AuthSystem existente)
  static async register(userData) {
    // Por defecto usa registro de cliente para mantener compatibilidad
    return this.registerCliente(userData);
  }
}


// Hacer disponible globalmente
window.RapiRushAPI = RapiRushAPI;

// Instancia para uso con tokens
window.rapiRushAPI = new RapiRushAPI();