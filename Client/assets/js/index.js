// assets/js/index.js - VERSIÓN SIMPLIFICADA CON API

// Mostrar restaurantes populares (ya se maneja en restaurantes.js)
function renderPopularRestaurants() {
  // Esta función ahora es manejada por initializeIndex() en restaurantes.js
  console.log('📋 Renderizado manejado por restaurantes.js');
}

// Renderizar restaurantes en resultsContainer
function renderRestaurants(data) {
  renderRestaurantsList(data, 'resultsContainer');
}

// Buscar restaurantes
async function buscarRestaurantes() {
  const query = document.getElementById('searchInput').value.trim();
  const restaurants = await searchRestaurantsAPI(query);
  renderRestaurants(restaurants);

  // Scroll a resultados
  const resultsContainer = document.getElementById('resultsContainer');
  if (resultsContainer) {
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Filtrar por categoría
async function filtrarPorCategoria(categoria) {
  const restaurants = await searchRestaurantsAPI('', categoria);
  renderRestaurants(restaurants);
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
  // Los restaurantes ya se cargan automáticamente desde restaurantes.js
  
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');

  if (searchInput) {
    searchInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') buscarRestaurantes();
    });
  }

  if (searchButton) {
    searchButton.addEventListener('click', buscarRestaurantes);
  }

  document.querySelectorAll('#categoryButtons button').forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.getAttribute('data-category');
      filtrarPorCategoria(categoria);
    });
  });
});