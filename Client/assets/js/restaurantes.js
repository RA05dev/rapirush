// assets/js/restaurantes.js - VERSIÓN CORREGIDA Y COMPLETA

// Función para obtener ID simple de restaurante
function getSimpleRestaurantId(uuid) {
    const firstChar = uuid.split('-')[0][0];
    return parseInt(firstChar, 16);
}

// === FUNCIONES UNIVERSALES DE RENDERIZADO ===

// ✅ FUNCIÓN OPTIMIZADA CORREGIDA
function renderRestaurantCard(r, showPopular = false) {
  // Pre-procesar categorías
  const categoriesText = Array.isArray(r.categories) 
    ? r.categories.map(c => c.name || c.id || '').join(', ')
    : r.categories || '';
  
  // Pre-calcular valores
  const simpleId = getSimpleRestaurantId(r.id);
  const deliveryCostFormatted = (r.deliveryCost || 0).toFixed(2);
  
  // Usar valores directamente
  const img = r.img || r.imagen || '';
  const name = r.name || r.nombre || '';
  const rating = r.rating || '';
  const reviews = r.reviews || '';
  const location = r.location || 'Ubicación no disponible';
  const deliveryTime = r.deliveryTime || '';
  const isOpen = r.isOpen;

  if (showPopular) {
    return `
      <div class="popular-item my-2">
        <div class="card restaurant-card shadow-sm h-100">
          <img src="${img}" class="card-img-top" alt="${name}" onerror="this.onerror=null;this.src='assets/Img/basedatos.png';">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${name}</h5>
              <span class="badge bg-success">
                <i class="bi bi-star-fill"></i> ${rating} ${reviews ? `(${reviews})` : ''}
              </span>
            </div>
            <p class="text-muted small mb-2">
              <i class="bi bi-geo-alt"></i> ${categoriesText}
            </p>
            <p class="text-muted small mb-3">
              <i class="bi bi-clock"></i> ${deliveryTime} • S/. ${deliveryCostFormatted} delivery
            </p>
            <a href="restaurante.html?id=${simpleId}" class="btn btn-primary w-100">Ver menú</a>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="col-md-6 col-lg-4 my-2">
      <div class="card restaurant-card shadow-sm h-100">
        <img src="${img}" class="card-img-top" alt="${name}" onerror="this.onerror=null;this.src='assets/Img/basedatos.png';">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${name}</h5>
            <span class="badge bg-success">
              <i class="bi bi-star-fill"></i> ${rating} ${reviews ? `(${reviews})` : ''}
            </span>
          </div>
          <div class="d-flex justify-content-between text-muted small mb-2">
            <div><i class="bi bi-tags"></i> ${categoriesText}</div>
            <div><i class="bi bi-geo-alt"></i> ${location}</div>
            <div><i class="bi bi-clock"></i> ${deliveryTime}</div>
          </div>
          <div class="d-flex justify-content-between text-muted small mb-3">
            <div><i class="ri-motorbike-fill"></i> S/. ${deliveryCostFormatted} delivery</div>
            <div>${isOpen ? '🟢 Abierto' : '🔴 Cerrado'}</div>
          </div>
          <a href="restaurante.html?id=${simpleId}" class="btn btn-primary w-100">Ver menú</a>
        </div>
      </div>
    </div>
  `;
}

// === VARIABLE GLOBAL PARA CACHE ===
let cachedRestaurants = null;

// ✅ RENDERIZAR LISTA CORREGIDA
function renderRestaurantsList(data, containerId, showPopular = false) {
  const container = document.getElementById(containerId);
  
  console.log(`🎯 Renderizando en contenedor: ${containerId}`, {
    containerExiste: !!container,
    datosRecibidos: data?.length || 0,
    showPopular: showPopular
  });

  if (!container) {
    console.error(`❌ Contenedor ${containerId} NO encontrado en el DOM`);
    return;
  }

  if (!data || data.length === 0) {
    console.warn(`⚠️ No hay datos para renderizar en ${containerId}`);
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <h5>No se encontraron resultados.</h5>
        <p class="text-muted">Prueba otro término o borra los filtros.</p>
      </div>
    `;
    return;
  }

  console.log(`🔄 Renderizando ${data.length} restaurantes en ${containerId}...`);

  // ✅ CORRECCIÓN: Usar la función renderRestaurantCard existente
  if (showPopular) {
    container.innerHTML = data.map(r => renderRestaurantCard(r, true)).join('');
  } else {
    container.innerHTML = data.map(r => renderRestaurantCard(r, false)).join('');
  }
  
  console.log(`✅ Renderizado completado en ${containerId}`);
}

// Obtener todos los restaurantes desde la API (con cache)
async function fetchAllRestaurants() {
  try {
    // ✅ ASEGURAR que cacheManager está disponible
    // Esperar máximo 1 segundo a que cache.js se cargue
    let cacheReady = window.cacheManager;
    let waitTime = 0;
    while (!cacheReady && waitTime < 1000) {
      await new Promise(r => setTimeout(r, 50));
      cacheReady = window.cacheManager;
      waitTime += 50;
    }

    // ✅ PRIMERO: Intentar obtener del caché mejorado
    if (window.cacheManager) {
      const cached = window.cacheManager.getRestaurants();
      if (cached) {
        console.log('📦 Restaurantes obtenidos del CACHÉ (sin llamada a BD)');
        return cached;
      }
    }

    // ✅ SEGUNDO: Usar caché local si existe
    if (cachedRestaurants) {
      console.log('📋 Usando restaurantes en cache local');
      return cachedRestaurants;
    }

    console.log('📤 Obteniendo restaurantes desde API (primera carga)...');
    console.time('⏱️ API Restaurantes');
    
    const response = await fetch('http://localhost:3000/api/restaurants');
    const result = await response.json();

    console.timeEnd('⏱️ API Restaurantes');

    console.log('📦 Respuesta completa de la API:', result);
    console.log('🔍 Estructura del primer restaurante:', result.data?.[0]);

    if (!response.ok) {
      throw new Error(result.error || 'Error al obtener restaurantes');
    }

    console.log(`📥 Restaurantes obtenidos: ${result.data?.length || 0}`);
    
    // ✅ GUARDAR EN AMBOS CACHES
    cachedRestaurants = result.data || [];
    if (window.cacheManager) {
      window.cacheManager.setRestaurants(cachedRestaurants);
    }
    return cachedRestaurants;

  } catch (error) {
    console.error('❌ Error obteniendo restaurantes:', error);
    
    // Mostrar error al usuario
    const containers = ['restaurantes-populares', 'restaurantsList', 'resultsContainer'];
    containers.forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `
          <div class="col-12 text-center py-5">
            <h5>Error al cargar restaurantes</h5>
            <p class="text-muted">No se pudieron cargar los restaurantes. Intenta recargar la página.</p>
            <button class="btn btn-primary mt-2" onclick="location.reload()">Reintentar</button>
          </div>
        `;
      }
    });
    
    return [];
  }
}

// ✅ FILTRAR EN CLIENTE (MUCHO MÁS RÁPIDO)
function filterRestaurantsLocal(restaurants, query = '', category = '') {
  const q = query.trim().toLowerCase();
  const catFilter = category.trim().toLowerCase();

  if (!q && !catFilter) {
    return restaurants;
  }

  return restaurants.filter(r => {
    const name = (r.name || r.nombre || '').toLowerCase();
    const desc = (r.description || r.descripcion || '').toLowerCase();
    const cats = Array.isArray(r.categories) 
      ? r.categories.join(', ').toLowerCase()
      : (r.categories || '').toLowerCase();

    // Filtra por búsqueda
    const matchQuery = !q || name.includes(q) || desc.includes(q) || cats.includes(q);

    // Filtra por categoría
    const matchCategory = !catFilter || cats.includes(catFilter);

    return matchQuery && matchCategory;
  });
}

// Inicialización para index.html
async function initializeIndex() {
  if (!window.location.pathname.includes('index.html') && 
      !window.location.pathname.endsWith('/')) return;

  console.log('🚀 Inicializando index.html...');
  console.time('⏱️ Tiempo total index.html');
  
  const restaurants = await fetchAllRestaurants();
  
  // Renderizar populares (primeros 6)
  const popularRestaurants = restaurants.slice(0, 6);
  renderRestaurantsList(popularRestaurants, 'restaurantes-populares', true);
  
  // Renderizar todos en resultsContainer
  renderRestaurantsList(restaurants, 'resultsContainer');
  
  console.timeEnd('⏱️ Tiempo total index.html');
}

// Inicialización para restaurantes.html
async function initializeRestaurantes() {
  if (!window.location.pathname.includes('restaurantes.html')) return;

  console.log('🚀 Inicializando restaurantes.html...');
  console.time('⏱️ Tiempo total restaurantes.html');
  
  const restaurantsList = document.getElementById('restaurantsList');
  if (!restaurantsList) {
    console.error('❌ Contenedor restaurantsList no encontrado en restaurantes.html');
    return;
  }

  // Leer filtros desde URL
  const params = new URLSearchParams(window.location.search);
  const query = params.get('search') || '';
  const category = params.get('category') || '';

  console.time('⏱️ Obtener restaurantes');
  const restaurants = await fetchAllRestaurants();
  console.timeEnd('⏱️ Obtener restaurantes');

  console.time('⏱️ Filtrar restaurantes');
  const filtered = filterRestaurantsLocal(restaurants, query, category);
  console.timeEnd('⏱️ Filtrar restaurantes');

  console.time('⏱️ Renderizar restaurantes');
  renderRestaurantsList(filtered, 'restaurantsList');
  console.timeEnd('⏱️ Renderizar restaurantes');
  
  console.timeEnd('⏱️ Tiempo total restaurantes.html');
}

// ✅ FUNCIÓN DEBUG TEMPORAL
function debugRender() {
  console.log('🔍 DEBUG - Estado actual:');
  console.log('- cachedRestaurants:', cachedRestaurants?.length);
  console.log('- Pathname:', window.location.pathname);
  
  // Verificar contenedores
  const containers = ['restaurantes-populares', 'resultsContainer', 'restaurantsList'];
  containers.forEach(id => {
    const el = document.getElementById(id);
    console.log(`- Contenedor ${id}:`, el ? 'ENCONTRADO' : 'NO ENCONTRADO');
  });
  
  // Forzar renderizado si hay datos
  if (cachedRestaurants && cachedRestaurants.length > 0) {
    console.log('🔄 Forzando renderizado desde debug...');
    initializeIndex();
    initializeRestaurantes();
  }
}

// Event listener principal
document.addEventListener('DOMContentLoaded', function() {
  console.log('🏠 DOM Content Loaded - Iniciando aplicación...');
  initializeIndex();
  initializeRestaurantes();
  
  // Ejecutar debug después de 3 segundos
  setTimeout(debugRender, 3000);
});

// === FUNCIONES GLOBALES PARA COMPATIBILIDAD ===
window.getBaseRestaurantData = fetchAllRestaurants;
window.filterRestaurants = filterRestaurantsLocal;
window.renderRestaurantsList = renderRestaurantsList;