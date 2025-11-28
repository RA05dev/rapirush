// assets/js/main.js - VERSIÓN CON API

if (!window.AuthSystem) {
    console.warn('AuthSystem no está disponible');
}

// ✅ FUNCIÓN PARA OBTENER PRODUCTOS DESDE API
async function fetchRestaurantProducts(restaurantId) {
  try {
    console.log(`📤 Obteniendo productos para restaurante: ${restaurantId}`);
    
    const response = await fetch(`http://localhost:3000/api/products/restaurant/${restaurantId}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Error al obtener productos');
    }

    console.log(`📥 Productos obtenidos: ${result.data?.length || 0} categorías`);
    return result.data || [];

  } catch (error) {
    console.error('❌ Error obteniendo productos:', error);
    
    // Mostrar error al usuario
    const categoriesContainer = document.getElementById('categories-container');
    if (categoriesContainer) {
      categoriesContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <h5>Error al cargar el menú</h5>
          <p class="text-muted">No se pudieron cargar los productos. Intenta recargar la página.</p>
          <button class="btn btn-primary mt-2" onclick="location.reload()">Reintentar</button>
        </div>
      `;
    }
    
    return [];
  }
}

// ✅ FUNCIÓN PARA OBTENER INFO RESTAURANTE DESDE API
async function fetchRestaurantInfo(restaurantId) {
  try {
    const response = await fetch(`http://localhost:3000/api/restaurants/${restaurantId}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Error al obtener información del restaurante');
    }

    return result.data;

  } catch (error) {
    console.error('❌ Error obteniendo info restaurante:', error);
    return null;
  }
}

// Inicialización cuando carga el DOM
document.addEventListener('DOMContentLoaded', async () => {
  // ✅ USAR window.cart en lugar de función duplicada
  if (window.cart && typeof window.cart.updateCartCount === 'function') {
    window.cart.updateCartCount();
  }

  // Solo ejecutar el código de detalle si estamos en la página de restaurante
  const categoriesContainer = document.getElementById('categories-container');
  if (!categoriesContainer) {
    return;
  }

  // Obtener restaurantId de URL (AHORA ES UUID, NO NÚMERO)
  const params = new URLSearchParams(window.location.search);
  const restaurantId = params.get('id');
  
  if (!restaurantId) {
    document.body.innerHTML = '<h2 class="text-center mt-5">Restaurante no encontrado</h2>';
    return;
  }

  console.log(`🔍 Cargando restaurante ID: ${restaurantId}`);

  // Cargar información del restaurante y productos en paralelo
  const [restaurantInfo, categories] = await Promise.all([
    fetchRestaurantInfo(restaurantId),
    fetchRestaurantProducts(restaurantId)
  ]);

  if (!restaurantInfo) {
    document.body.innerHTML = '<h2 class="text-center mt-5">Restaurante no encontrado</h2>';
    return;
  }

  if (categories.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'text-center py-5';
    emptyMsg.innerHTML = '<h5>No hay productos disponibles en este restaurante.</h5>';
    categoriesContainer.appendChild(emptyMsg);
    return;
  }

  // Renderizar título y categorías
  document.title = restaurantInfo.name;
  const nameEl = document.getElementById('restaurant-name');
  const nameHeaderEl = document.getElementById('restaurant-name-header');
  if (nameEl) nameEl.textContent = restaurantInfo.name;
  if (nameHeaderEl) nameHeaderEl.textContent = restaurantInfo.name;

  // Renderizar cada categoría y sus productos
  renderCategories(categories, restaurantInfo, categoriesContainer);
});

// ✅ FUNCIÓN PARA RENDERIZAR CATEGORÍAS
function renderCategories(categories, restaurantInfo, container) {
  categories.forEach(category => {
    const section = document.createElement('section');
    section.className = "mb-5";
    section.innerHTML = `
      <h3 class="mb-3"><i class="${category.icon} me-2"></i> ${category.name}</h3>
      <div class="row" id="${category.id}"></div>
    `;
    container.appendChild(section);

    const row = section.querySelector('.row');
    renderProducts(category.products, row, restaurantInfo, category.name);
  });
}

// ✅ FUNCIÓN PARA RENDERIZAR PRODUCTOS
function renderProducts(products, container, restaurantInfo, categoryName) {
  products.forEach(product => {
    const col = document.createElement('div');
    col.className = "col-12 col-md-6 col-lg-4 mb-4";

    // Obtener el precio base del producto
    const basePrice = product.basePrice || (product.sizes ? Object.values(product.sizes)[0] : 0);

    // Preparar tamaños de forma segura
    const sizesSafe = product.sizes ? JSON.stringify(product.sizes).replace(/"/g, '&quot;') : 'null';
    const escapedName = escapeForOnclick(product.name || '');
    const escapedDesc = escapeForOnclick(product.description || '');
    const escapedImage = escapeForOnclick(product.image || '');
    const escapedRestaurant = escapeForOnclick(restaurantInfo.name || '');

    col.innerHTML = `
    <div class="restaurant-card shadow-sm h-100">
      <img loading="lazy" src="${product.image || ''}" class="w-100" alt="${product.name || ''}" onerror="this.onerror=null;this.src='assets/Img/basedatos.png';">
      <div class="card-body">
        <h5 class="mb-1">${product.name || ''} <span class="badge bg-secondary text-white ms-2">${categoryName}</span></h5>
        <p class="text-small text-muted mb-2">${product.description || ''}</p>
        <div class="d-flex align-items-center justify-content-between mb-2 text-small text-muted">
          <div><i class="bi bi-star-fill text-warning"></i> ${product.rating || restaurantInfo.rating || ''} ${product.reviews ? `(${product.reviews})` : restaurantInfo.reviews ? `(${restaurantInfo.reviews})` : ''}</div>
          <div><i class="bi bi-clock"></i> ${restaurantInfo.deliveryTime || ''}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-bold">Desde S/ ${Number(basePrice).toFixed(2)}</div>
            <div class="text-small text-muted">Envío S/ ${restaurantInfo.deliveryCost || '0'}.00</div>
          </div>
          <button class="btn btn-primary btn-sm"
            onclick="openProductModal('${escapedName}', ${basePrice}, '${escapedDesc}', '${escapedImage}', ${sizesSafe}, '${escapedRestaurant}')">
            <i class="bi bi-cart-plus"></i> Agregar
          </button>
        </div>
      </div>
    </div>
    `;
    container.appendChild(col);
  });
}

// === LAS FUNCIONES DEL MODAL SE MANTIENEN IGUAL ===
let currentProduct = null;
let currentQty = 1;

function openProductModal(name, price, description, image, sizes, restaurant) {
  currentProduct = { 
    name, 
    description, 
    image, 
    basePrice: Number(price),
    sizes: typeof sizes === 'string' ? JSON.parse(sizes.replace(/&quot;/g, '"')) : sizes,
    restaurant: restaurant
  };
  currentQty = 1;

  // Elementos del modal
  const nameEl = document.getElementById('modalProductName');
  const descEl = document.getElementById('modalProductDescription');
  const imgEl = document.getElementById('modalProductImage');
  const qtyEl = document.getElementById('modal-quantity');
  const totalEl = document.getElementById('modal-total-price');
  const notesEl = document.getElementById('product-notes');
  const sizesContainer = document.getElementById('sizes-container');

  // Resetear campos
  if (nameEl) nameEl.textContent = name;
  if (descEl) descEl.textContent = description;
  if (imgEl) imgEl.src = image;
  if (qtyEl) qtyEl.value = currentQty;
  if (notesEl) notesEl.value = '';

  // Actualizar opciones de tamaño
  if (sizesContainer && sizes) {
    sizesContainer.innerHTML = '';
    Object.entries(sizes).forEach(([size, price], index) => {
      const div = document.createElement('div');
      div.className = 'form-check';
      div.innerHTML = `
        <input class="form-check-input" type="radio" name="size" 
               id="size-${size}" value="${price}" 
               ${index === 0 ? 'checked' : ''}>
        <label class="form-check-label" for="size-${size}">
          ${size.charAt(0).toUpperCase() + size.slice(1)} - S/ ${price.toFixed(2)}
        </label>
      `;
      sizesContainer.appendChild(div);
    });

    // Establecer precio inicial basado en el primer tamaño
    const firstSize = Object.values(sizes)[0];
    currentProduct.basePrice = Number(firstSize);
    if (totalEl) totalEl.textContent = currentProduct.basePrice.toFixed(2);

    // Escuchar cambios de tamaño
    document.querySelectorAll('input[name="size"]').forEach(radio => {
      radio.onchange = () => {
        currentProduct.basePrice = Number(radio.value);
        updateModalTotal();
      };
    });
  } else if (totalEl) {
    totalEl.textContent = currentProduct.basePrice.toFixed(2);
  }

  // Mostrar modal
  const modalEl = document.getElementById('productModal');
  if (modalEl) new bootstrap.Modal(modalEl).show();
}

function changeModalQuantity(delta) {
  const qtyEl = document.getElementById('modal-quantity');
  currentQty = Math.max(1, currentQty + delta);
  qtyEl.value = currentQty;
  updateModalTotal();
}

function updateModalTotal() {
  const totalEl = document.getElementById('modal-total-price');
  const total = currentProduct.basePrice * currentQty;
  if (totalEl) totalEl.textContent = total.toFixed(2);
}

function addFromModal() {
    if (!currentProduct) return;

    const notes = document.getElementById('product-notes').value.trim();
    const sizeRadio = document.querySelector('input[name="size"]:checked');
    const sizeLabel = sizeRadio ? sizeRadio.nextElementSibling.textContent.split(' - ')[0].trim() : 'Personal';
    const total = currentProduct.basePrice * currentQty;

    if (window.cart && typeof window.cart.addItem === 'function') {
        window.cart.addItem({
            name: currentProduct.name,
            price: currentProduct.basePrice,
            size: sizeLabel,
            quantity: currentQty,
            total: total,
            notes: notes,
            image: currentProduct.image,
            restaurant: currentProduct.restaurant || 'Restaurante'
        });
    } else {
        console.error('carrito.js no está cargado correctamente');
        return;
    }

    if (window.CartUtils && typeof window.CartUtils.showToast === 'function') {
        window.CartUtils.showToast('Producto agregado al carrito');
    } else {
        console.log('Producto agregado al carrito');
    }

    const modalEl = document.getElementById('productModal');
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
}

function escapeForOnclick(str) {
  return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Cerrar sesión (se mantiene igual)
document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      localStorage.removeItem("pedidosCliente");
      
      if (window.cart && typeof window.cart.clearCart === 'function') {
        window.cart.clearCart();
      } else {
        localStorage.removeItem("cart");
      }

      window.location.href = "index.html";
    });
  }
});