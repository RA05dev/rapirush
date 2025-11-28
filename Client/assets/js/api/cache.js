/**
 * cache.js - Sistema de caché para restaurantes y productos
 * Evita llamadas repetidas a la API
 */

class CacheManager {
  constructor() {
    this.cache = {
      restaurants: null,
      restaurantProducts: {}, // { restauranteId: [...products] }
      timestamps: {
        restaurants: null,
        restaurantProducts: {}
      }
    };
    
    // Tiempo de caché: 30 minutos
    this.CACHE_DURATION = 30 * 60 * 1000;
    
    this.loadFromLocalStorage();
  }

  /**
   * Cargar caché desde localStorage
   */
  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('rapiRush_cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cache = parsed;
        console.log('✅ Caché cargado desde localStorage');
      }
    } catch (error) {
      console.warn('⚠️ Error cargando caché:', error);
    }
  }

  /**
   * Guardar caché en localStorage
   */
  saveToLocalStorage() {
    try {
      localStorage.setItem('rapiRush_cache', JSON.stringify(this.cache));
      console.log('💾 Caché guardado en localStorage');
    } catch (error) {
      console.warn('⚠️ Error guardando caché:', error);
    }
  }

  /**
   * ¿Es el caché válido (no expirado)?
   */
  isValid(type, id = null) {
    const timestamp = id 
      ? this.cache.timestamps.restaurantProducts[id]
      : this.cache.timestamps[type];
    
    if (!timestamp) return false;
    
    const elapsed = Date.now() - timestamp;
    return elapsed < this.CACHE_DURATION;
  }

  /**
   * Obtener restaurantes del caché
   */
  getRestaurants() {
    if (this.isValid('restaurants') && this.cache.restaurants) {
      console.log('📦 Restaurantes obtenidos del CACHÉ (sin llamada a BD)');
      return this.cache.restaurants;
    }
    return null;
  }

  /**
   * Guardar restaurantes en caché
   */
  setRestaurants(restaurants) {
    this.cache.restaurants = restaurants;
    this.cache.timestamps.restaurants = Date.now();
    this.saveToLocalStorage();
    console.log(`✅ ${restaurants.length} restaurantes guardados en caché`);
  }

  /**
   * Obtener productos de un restaurante del caché
   */
  getRestaurantProducts(restaurantId) {
    if (this.isValid('restaurantProducts', restaurantId) && 
        this.cache.restaurantProducts[restaurantId]) {
      console.log(`📦 Productos de restaurante ${restaurantId} obtenidos del CACHÉ`);
      return this.cache.restaurantProducts[restaurantId];
    }
    return null;
  }

  /**
   * Guardar productos de un restaurante en caché
   */
  setRestaurantProducts(restaurantId, products) {
    this.cache.restaurantProducts[restaurantId] = products;
    this.cache.timestamps.restaurantProducts[restaurantId] = Date.now();
    this.saveToLocalStorage();
    console.log(`✅ ${products.length} productos de restaurante ${restaurantId} guardados en caché`);
  }

  /**
   * Limpiar todo el caché
   */
  clearAll() {
    this.cache = {
      restaurants: null,
      restaurantProducts: {},
      timestamps: {
        restaurants: null,
        restaurantProducts: {}
      }
    };
    localStorage.removeItem('rapiRush_cache');
    console.log('🗑️ Caché completamente limpiado');
  }

  /**
   * Limpiar solo restaurantes
   */
  clearRestaurants() {
    this.cache.restaurants = null;
    this.cache.timestamps.restaurants = null;
    this.saveToLocalStorage();
    console.log('🗑️ Caché de restaurantes limpiado');
  }

  /**
   * Obtener estadísticas del caché
   */
  getStats() {
    const restaurantCount = this.cache.restaurants ? this.cache.restaurants.length : 0;
    const productCounts = Object.keys(this.cache.restaurantProducts)
      .map(id => this.cache.restaurantProducts[id].length)
      .reduce((a, b) => a + b, 0);

    return {
      restaurantCount,
      productCounts,
      isValid: {
        restaurants: this.isValid('restaurants'),
        products: Object.keys(this.cache.restaurantProducts).length > 0
      }
    };
  }
}

// Instancia global
window.cacheManager = new CacheManager();
