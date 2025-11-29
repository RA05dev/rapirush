// assets/js/index.js - VERSIÓN SIMPLIFICADA CON API

// Mostrar restaurantes populares (ya se maneja en restaurantes.js)
function renderPopularRestaurants() {
  // Esta función ahora es manejada por initializeIndex() en restaurantes.js
  console.log('📋 Renderizado manejado por restaurantes.js');
}

// Renderizar restaurantes en resultsContainer
async function renderRestaurants(data) {
  // Usar el método del API para renderizar
  if (window.rapiRushAPI) {
    window.rapiRushAPI.renderRestaurantsList(data, 'resultsContainer');
  }
}

// Buscar restaurantes
async function buscarRestaurantes() {
  const query = document.getElementById('searchInput').value.trim();
  console.log('🔍 Buscando restaurantes con query:', query);
  
  const restaurants = await window.rapiRushAPI.searchRestaurants(query);
  await renderRestaurants(restaurants);

  // Scroll a resultados
  const resultsContainer = document.getElementById('resultsContainer');
  if (resultsContainer) {
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Filtrar por categoría
async function filtrarPorCategoria(categoria) {
  console.log('🏷️ Filtrando por categoría:', categoria);
  
  let restaurants;
  if (categoria === 'todos' || categoria === 'Todos') {
    // Si seleccionan "Todos", obtener todos los restaurantes
    restaurants = await window.rapiRushAPI.getAllRestaurants();
  } else {
    restaurants = await window.rapiRushAPI.searchRestaurants('', categoria);
  }
  
  await renderRestaurants(restaurants);
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