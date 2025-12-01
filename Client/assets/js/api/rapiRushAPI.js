const API_BASE = 'http://localhost:3000/api';

console.log('📦 Cargando RapiRushAPI.js desde:', API_BASE);

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
            nombres: userData.nombres || userData.fullName || '',
            telefono: userData.telefono || userData.phone || '',
            direccion: userData.direccion || userData.address || ''
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

  // ✅ REGISTRO RESTAURANTE (desde agregarestaurante.html) - CORREGIDO
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
          password: userData.password,
          userData: {
            nombre: userData.nombre,
            telefono: userData.telefono,
            direccion: userData.direccion,
            tipo_comida: userData.tipoComida, // ✅ CAMBIADO: tipoComida → tipo_comida
            restaurante_url: userData.image_url || null, // ✅ CAMBIADO: image_url → restaurante_url
            descripcion: userData.descripcion || '',
            tiempo_delivery: userData.tiempo_delivery || 30,
            delivery_cost: userData.delivery_cost || 0
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

  // ✅ REGISTRO REPARTIDOR (desde serepartidor.html) - CORREGIDO
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
          password: userData.password,
          userData: {
            nombres: userData.nombre, // ✅ CAMBIADO: nombre → nombres
            telefono: userData.telefono,
            tipo_vehiculo: userData.vehiculo, // ✅ CAMBIADO: vehiculo → tipo_vehiculo
            placa: userData.placa || ''
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
      console.log('📍 URL de destino:', `${this.baseURL}/auth/login`);

      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      console.log('✅ Respuesta recibida del servidor. Status:', response.status);
      
      const data = await response.json();
      console.log('📥 Respuesta login parseada:', data);

      if (!response.ok) {
        const error = new Error(data.error || 'Error en el login');
        error.code = data.code;
        throw error;
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
        const error = new Error(data.error || 'Error en el login');
        error.code = data.code;
        throw error;
      }

      return data;

    } catch (error) {
      console.error('💥 Error en login:', error);
      throw error;
    }
  }

  // ✅ LOGOUT
  async logout() {
    try {
      const response = await this.request('/auth/logout', {
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  // ✅ OBTENER PERFIL (requiere autenticación)
  async getProfile() {
    try {
      const response = await this.request('/auth/profile');
      return response;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  }

  // ✅ VERIFICAR TOKEN
  async verifyToken() {
    try {
      const response = await this.request('/auth/verify');
      return response;
    } catch (error) {
      console.error('Error verificando token:', error);
      throw error;
    }
  }

  // ✅ OBTENER INFORMACIÓN DEL USUARIO ACTUAL
  async getCurrentUser() {
    try {
      const response = await this.request('/auth/current-user');
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo usuario actual:', error);
      throw error;
    }
  }

  // ✅ MÉTODOS PARA PEDIDOS
  async createOrder(orderData) {
    try {
      console.log('📦 Creando pedido en servidor...', orderData);
      
      const response = await this.request('/orders/create', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      return response;

    } catch (error) {
      console.error('❌ Error creando pedido:', error);
      throw error;
    }
  }

  async getMyOrders() {
    try {
      console.log('📋 Obteniendo pedidos del usuario...');
      
      const response = await this.request('/orders/my-orders');
      return response;

    } catch (error) {
      console.error('❌ Error obteniendo pedidos:', error);
      throw error;
    }
  }

  // ✅ REENVIAR EMAIL DE VERIFICACIÓN
  async resendVerification() {
    try {
      const response = await this.request('/auth/resend-verification', {
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Error reenviando verificación:', error);
      throw error;
    }
  }

  // ✅ MÉTODO COMPATIBILIDAD (para AuthSystem existente)
  static async register(userData) {
    return this.registerCliente(userData);
  }

  // ✅ BUSCAR RESTAURANTES POR QUERY O CATEGORÍA
  async searchRestaurants(query = '', category = '') {
    try {
      console.log('🔍 Buscando restaurantes:', { query, category });
      
      let endpoint = '/restaurants/search?';
      const params = new URLSearchParams();
      
      if (query) params.append('query', query);
      if (category) params.append('category', category);
      
      endpoint += params.toString();
      
      const response = await this.request(endpoint);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error en búsqueda:', error);
      return [];
    }
  }

  // ✅ OBTENER TODOS LOS RESTAURANTES
  async getAllRestaurants() {
    try {
      console.log('📋 Obteniendo todos los restaurantes');
      
      const response = await this.request('/restaurants');
      return response.data || response || [];
    } catch (error) {
      console.error('❌ Error obteniendo restaurantes:', error);
      return [];
    }
  }

  // ✅ OBTENER RESTAURANTE POR ID
  async getRestaurantById(restaurantId) {
    try {
      console.log('📋 Obteniendo restaurante:', restaurantId);
      
      const response = await this.request(`/restaurants/${restaurantId}`);
      return response.data || response;
    } catch (error) {
      console.error('❌ Error obteniendo restaurante:', error);
      return null;
    }
  }

  // ✅ OBTENER PRODUCTOS DE UN RESTAURANTE
  async getRestaurantProducts(restaurantId) {
    try {
      console.log('📦 Obteniendo productos del restaurante:', restaurantId);
      console.log('🔗 URL:', `/products/restaurant/${restaurantId}`);
      
      const response = await this.request(`/products/restaurant/${restaurantId}`);
      
      console.log('✅ Respuesta recibida del servidor:', response);
      console.log('📊 Tipo de datos en response.data:', typeof response.data);
      console.log('📦 Contenido response.data:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ Array de ${response.data.length} productos`);
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        console.log('📂 Objeto agrupado recibido:', Object.keys(response.data));
        // Si vienen agrupados, convertir a array plano
        let allProducts = [];
        Object.values(response.data).forEach(category => {
          if (Array.isArray(category)) {
            allProducts = allProducts.concat(category);
          }
        });
        console.log(`✅ ${allProducts.length} productos extraídos de objeto agrupado`);
        return allProducts;
      }
      
      console.warn('⚠️ response.data vacío o inválido');
      return [];
    } catch (error) {
      console.error('❌ Error obteniendo productos:', error);
      console.error('   Detalles:', error.message);
      console.error('   Stack:', error.stack);
      return [];
    }
  }

  // ✅ RENDERIZAR LISTA DE RESTAURANTES - CORREGIDO CON BICICLETA/MOTO
  renderRestaurantsList(data, containerId = 'resultsContainer') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('⚠️ Contenedor no encontrado:', containerId);
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = '<div class="col-12 text-center text-muted py-5"><p>No se encontraron restaurantes</p></div>';
      return;
    }

    const html = data.map(restaurant => {
      const imageUrl = restaurant.img || restaurant.restaurante_url || restaurant.image_url || restaurant.image || '/Client/assets/Img/default.png';
      const name = restaurant.name || restaurant.restaurante_nombre || 'Restaurante';
      const description = restaurant.description || restaurant.restaurante_descripcion || '';
      const rating = restaurant.rating || restaurant.calificacion_promedio || 4.5;
      const reviews = restaurant.reviews || restaurant.numero_reviews || 0;
      const deliveryTime = restaurant.deliveryTime || restaurant.tiempo_delivery ? `${restaurant.tiempo_delivery} min` : '30-45 min';
      const deliveryCost = restaurant.deliveryCost || restaurant.delivery_cost || 2.99;
      const id = restaurant.id || restaurant.restaurante_id || '';

      return `
        <div class="col-md-4 mb-4">
          <div class="card h-100 restaurant-card">
            <img src="${imageUrl}" class="card-img-top" alt="${name}" style="height: 200px; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <p class="card-text text-truncate">${description}</p>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <small class="text-muted">⭐ ${rating.toFixed(1)} (${reviews})</small>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <small>🚴 ${deliveryTime}</small> <!-- ✅ CAMBIADO: 🚚 → 🚴 -->
                <small>$${typeof deliveryCost === 'number' ? deliveryCost.toFixed(2) : deliveryCost}</small>
              </div>
              <a href="restaurante.html?id=${id}" class="btn btn-primary w-100">Ver menú</a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `<div class="row">${html}</div>`;
    console.log('✅ Restaurantes renderizados en:', containerId);
  }

  // ✅ ACTUALIZAR ESTADO DEL PEDIDO
  async updateOrderStatus(orderId, newStatus) {
    try {
      console.log('📝 Actualizando estado del pedido:', { orderId, newStatus });
      
      const response = await this.request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ nuevoEstado: newStatus }) // ✅ CAMBIADO: estado → nuevoEstado
      });

      return response;
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      throw error;
    }
  }

  // ✅ OBTENER PEDIDOS DEL RESTAURANTE
  async getRestaurantOrders() {
    try {
      console.log('📋 Obteniendo pedidos del restaurante...');
      
      const response = await this.request('/orders/restaurant');
      return response.orders || [];
    } catch (error) {
      console.error('❌ Error obteniendo pedidos del restaurante:', error);
      return [];
    }
  }

  // ✅ OBTENER DETALLES DE UN PEDIDO
  async getOrderById(orderId) {
    try {
      console.log('📋 Obteniendo detalles del pedido:', orderId);
      
      const response = await this.request(`/orders/${orderId}`);
      return response.order || response;
    } catch (error) {
      console.error('❌ Error obteniendo pedido:', error);
      return null;
    }
  }

  // ✅ OBTENER PEDIDOS DEL REPARTIDOR
  async getRepartidorOrders() {
    try {
      console.log('📋 Obteniendo pedidos del repartidor...');
      
      const response = await this.request('/orders/repartidor');
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo pedidos del repartidor:', error);
      return { assignedOrders: [], availableOrders: [] };
    }
  }

  // ✅ ASIGNAR REPARTIDOR A PEDIDO
  async assignRepartidor(orderId) {
    try {
      console.log('🚴 Asignando repartidor al pedido:', orderId);
      
      const response = await this.request(`/orders/${orderId}/assign-repartidor`, {
        method: 'POST'
      });

      return response;
    } catch (error) {
      console.error('❌ Error asignando repartidor:', error);
      throw error;
    }
  }

  // ✅ CREAR PRODUCTO (para restaurantes)
  async createProduct(productData) {
    try {
      console.log('📦 Creando producto:', productData);
      
      const response = await this.request('/products/create', {
        method: 'POST',
        body: JSON.stringify(productData)
      });

      return response;
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      throw error;
    }
  }

  // ✅ ACTUALIZAR PRODUCTO
  async updateProduct(productId, productData) {
    try {
      console.log('📦 Actualizando producto:', productId);
      
      const response = await this.request(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });

      return response;
    } catch (error) {
      console.error('❌ Error actualizando producto:', error);
      throw error;
    }
  }

  // ✅ ELIMINAR PRODUCTO
  async deleteProduct(productId) {
    try {
      console.log('🗑️ Eliminando producto:', productId);
      
      const response = await this.request(`/products/${productId}`, {
        method: 'DELETE'
      });

      return response;
    } catch (error) {
      console.error('❌ Error eliminando producto:', error);
      throw error;
    }
  }

  // ✅ OBTENER TAMAÑOS DE PRODUCTO
  async getProductSizes(productId) {
    try {
      console.log('📏 Obteniendo tamaños del producto:', productId);
      
      const response = await this.request(`/products/${productId}/sizes`);
      return response.sizes || { available: [], unavailable: [] };
    } catch (error) {
      console.error('❌ Error obteniendo tamaños:', error);
      return { available: [], unavailable: [] };
    }
  }

  // ✅ OBTENER TODAS LAS CATEGORÍAS
  async getCategories() {
    try {
      console.log('📂 Obteniendo categorías...');
      
      const response = await this.request('/products/categories');
      return response.categories || [];
    } catch (error) {
      console.error('❌ Error obteniendo categorías:', error);
      return [];
    }
  }
}

// Hacer disponible globalmente
window.RapiRushAPI = RapiRushAPI;

// Instancia para uso con tokens
window.rapiRushAPI = new RapiRushAPI();

console.log('✅ RapiRushAPI.js cargado. window.rapiRushAPI:', !!window.rapiRushAPI);