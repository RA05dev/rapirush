// assets/js/main.js - VERSIÓN CORREGIDA SIN DUPLICADOS
console.log('📦 main.js cargado - Versión corregida');

// ✅ VARIABLES GLOBALES DEL MODAL (MANTENER)
let currentProduct = null;
let currentQty = 1;

// 🎨 FUNCIÓN GLOBAL DE ALERTA - MOSTRAR EN PANTALLA
window.globalShowAlert = function(message, type = 'info', duration = 5000) {
    // Crear contenedor si no existe
    let alertContainer = document.getElementById('globalAlertContainer');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'globalAlertContainer';
        alertContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            gap: 10px;
            display: flex;
            flex-direction: column;
            pointer-events: none;
        `;
        document.body.appendChild(alertContainer);
    }

    // Crear alerta individual
    const alertEl = document.createElement('div');
    const typeClass = {
        'success': 'alert-success',
        'danger': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info';

    const icon = {
        'success': '✅',
        'danger': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    }[type] || 'ℹ️';

    alertEl.className = `alert ${typeClass} alert-dismissible fade show`;
    alertEl.style.cssText = `
        pointer-events: auto;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-in-out;
    `;
    alertEl.innerHTML = `
        <div class="d-flex align-items-center">
            <span style="font-size: 1.3em; margin-right: 10px;">${icon}</span>
            <div style="flex: 1;">${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Agregar estilos de animación si no existen
    if (!document.getElementById('globalAlertStyles')) {
        const style = document.createElement('style');
        style.id = 'globalAlertStyles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    alertContainer.appendChild(alertEl);

    // Auto-dismiss
    if (duration > 0) {
        setTimeout(() => {
            alertEl.style.animation = 'slideOut 0.3s ease-in-out';
            setTimeout(() => alertEl.remove(), 300);
        }, duration);
    }

    return alertEl;
};

// ✅ INICIALIZACIÓN BÁSICA DEL DOM
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🏠 main.js - DOM cargado');
    
    // ✅ ACTUALIZAR CARRITO SI EXISTE
    if (window.cart && typeof window.cart.updateCartCount === 'function') {
        window.cart.updateCartCount();
    }

    // ✅ ACTUALIZAR UI DE AUTH SI EXISTE
    if (window.authManager && typeof window.authManager.updateGlobalUI === 'function') {
        setTimeout(() => {
            window.authManager.updateGlobalUI();
        }, 100);
    }

    // ✅ SOLO ejecutar código de restaurante si estamos en restaurante.html
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) {
        console.log('ℹ️ No en página de restaurante - omitiendo carga de productos');
        return;
    }

    console.log('🍽️ Iniciando carga de restaurante...');
    
    // Obtener restaurantId de URL
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get('id');
    
    if (!restaurantId) {
        console.error('❌ No se encontró ID de restaurante en URL');
        categoriesContainer.innerHTML = '<h2 class="text-center mt-5">Restaurante no encontrado</h2>';
        return;
    }

    console.log(`🔍 Cargando restaurante ID: ${restaurantId}`);

    try {
        await loadRestaurantFallback(restaurantId);
    } catch (error) {
        console.error('❌ Error cargando restaurante:', error);
        categoriesContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <h5>Error al cargar el restaurante</h5>
                <p class="text-muted">${error.message}</p>
                <button class="btn btn-primary mt-2" onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
});

// ✅ FUNCIÓN DE FALLBACK (solo si restaurantApp no existe)
async function loadRestaurantFallback(restaurantId) {
    console.log('🔄 Usando fallback para cargar restaurante...');
    console.log('📍 restaurantId:', restaurantId);
    
    const categoriesContainer = document.getElementById('categories-container');
    console.log('✅ Contenedor encontrado:', !!categoriesContainer);
    
    if (!window.rapiRushAPI) {
        console.error('❌ window.rapiRushAPI NO está disponible');
        throw new Error('API no disponible');
    }
    console.log('✅ window.rapiRushAPI disponible');

    // Cargar información del restaurante y productos
    console.log('⏳ Cargando restaurante y productos en paralelo...');
    
    const [restaurantInfo, products] = await Promise.all([
        window.rapiRushAPI.getRestaurantById(restaurantId),
        window.rapiRushAPI.getRestaurantProducts(restaurantId)
    ]);

    console.log('📋 Restaurante obtenido:', restaurantInfo?.name || restaurantInfo?.restaurante_nombre);
    console.log('📦 Productos obtenidos:', Array.isArray(products) ? products.length : 'NO es array');

    if (!restaurantInfo) {
        console.error('❌ Restaurante no encontrado');
        throw new Error('Restaurante no encontrado');
    }

    if (!products || products.length === 0) {
        console.warn('⚠️ Sin productos para este restaurante');
        categoriesContainer.innerHTML = '<div class="text-center py-5"><h5>No hay productos disponibles</h5></div>';
        return;
    }

    // Renderizar información básica
    console.log('🎨 Actualizando títulos...');
    document.title = restaurantInfo.name || restaurantInfo.restaurante_nombre || 'Restaurante';
    
    const nameEl = document.getElementById('restaurant-name');
    const nameHeaderEl = document.getElementById('restaurant-name-header');
    
    if (nameEl) {
        nameEl.textContent = restaurantInfo.name || restaurantInfo.restaurante_nombre;
        console.log('✅ Título en pestaña actualizado');
    }
    if (nameHeaderEl) {
        nameHeaderEl.textContent = restaurantInfo.name || restaurantInfo.restaurante_nombre;
        console.log('✅ Encabezado actualizado');
    }

    // Renderizar productos directamente sin depender de restaurantApp
    console.log('🚀 Llamando a renderProductsByCategories...');
    renderProductsByCategories(products, restaurantInfo, categoriesContainer);
}

// ✅ RENDERIZAR PRODUCTOS POR CATEGORÍAS
function renderProductsByCategories(products, restaurantInfo, container) {
    console.log('🎨 renderProductsByCategories iniciado');
    console.log('📦 Productos recibidos:', products);
    console.log('🏪 Info restaurante:', restaurantInfo);
    
    if (!products || products.length === 0) {
        console.warn('⚠️ No hay productos para renderizar');
        container.innerHTML = '<div class="text-center py-5"><h5>No hay productos disponibles</h5></div>';
        return;
    }

    // Agrupar productos por categoría
    console.log('📂 Agrupando productos por categoría...');
    const grouped = {};
    
    products.forEach(product => {
        const category = product.categoria_nombre || 'Sin categoría';
        console.log(`  - ${product.nombre} → ${category}`);
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(product);
    });

    console.log('✅ Agrupamiento completo:', Object.keys(grouped));

    // Renderizar categorías en orden fijo
    const categoryOrder = ['Productos', 'Complementos', 'Bebidas'];
    let html = '';
    let productCount = 0;

    categoryOrder.forEach(categoryName => {
        const categoryProducts = grouped[categoryName];
        
        if (!categoryProducts || categoryProducts.length === 0) {
            console.log(`⚠️ Categoría ${categoryName} vacía`);
            return;
        }

        console.log(`📂 Renderizando ${categoryName}: ${categoryProducts.length} productos`);
        
        html += `
            <div class="mb-5">
                <h3 class="mb-4">${categoryName}</h3>
                <div class="row g-4">
        `;

        categoryProducts.forEach(product => {
            productCount++;
            const name = product.nombre || 'Sin nombre';
            const price = product.precio || 0;
            const description = product.descripcion || '';
            const image = product.imagen_url || 'assets/Img/default.png';
            const sizes = product.tamaños || [];
            const restaurantName = restaurantInfo.name || restaurantInfo.restaurante_nombre || 'Restaurante';
            const tiempoPrep = product.tiempo_preparacion || 15;
            const rating = product.reseñas || product.calificacion || 4.5;
            const reviews = product.numero_reviews || 0;

            html += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${image}" class="card-img-top" alt="${name}" style="height: 200px; object-fit: cover;" onerror="this.src='assets/Img/default.png';">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title mb-2">${name}</h5>
                            <p class="card-text text-muted small mb-2">${description}</p>
                            <div class="d-flex justify-content-between text-muted small mb-3">
                                <span><i class="bi bi-clock"></i> ${tiempoPrep} min</span>
                                <span><i class="bi bi-star-fill" style="color: #ffc107;"></i> ${rating.toFixed(1)} (${reviews})</span>
                            </div>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="h5 mb-0 text-primary">S/ ${parseFloat(price).toFixed(2)}</span>
                                    <button class="btn btn-sm btn-primary btn-open-product" 
                                            data-producto-id="${product.producto_id}"
                                            data-name="${name}"
                                            data-price="${price}"
                                            data-description="${description}"
                                            data-image="${image}"
                                            data-sizes='${JSON.stringify(sizes)}'
                                            data-restaurant="${restaurantName}"
                                            data-restaurant-id="${restaurantInfo.id}">
                                        <i class="bi bi-cart-plus"></i> Agregar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    console.log(`✅ Total productos renderizados: ${productCount}`);
    console.log('📝 HTML generado, insertando en DOM...');
    
    container.innerHTML = html;
    console.log('✅ Productos renderizados exitosamente en el DOM');
    
    if (productCount === 0) {
        console.warn('⚠️ No se renderizó ningún producto');
        container.innerHTML = '<div class="text-center py-5"><h5>No hay productos disponibles</h5></div>';
    }
    
    // ✅ AGREGAR EVENT LISTENERS A LOS BOTONES
    document.querySelectorAll('.btn-open-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const productoId = this.dataset.productoId;
            const name = this.dataset.name;
            const price = this.dataset.price;
            const description = this.dataset.description;
            const image = this.dataset.image;
            const sizes = JSON.parse(this.dataset.sizes);
            const restaurant = this.dataset.restaurant;
            const restaurantId = this.dataset.restaurantId;
            
            openProductModal(productoId, name, price, description, image, sizes, restaurant, restaurantId);
        });
    });
}

// === 🎯 FUNCIONES DEL MODAL (MANTENER - NO DUPLICADAS EN OTROS ARCHIVOS) ===

function openProductModal(producto_id, name, price, description, image, sizes, restaurant, restaurante_id) {
    console.log('🔄 Abriendo modal para:', name);
    console.log('  Producto ID:', producto_id);
    console.log('  Precio recibido:', price, 'Tipo:', typeof price);
    console.log('  Sizes recibido:', sizes, 'Tipo:', typeof sizes);
    
    // Parsear sizes si vienen como string
    let parsedSizes = sizes;
    if (typeof sizes === 'string') {
        try {
            parsedSizes = JSON.parse(sizes);
            console.log('✅ Sizes parseado desde string');
        } catch (e) {
            console.warn('⚠️ No se pudo parsear sizes, usando array vacío');
            parsedSizes = [];
        }
    }
    
    currentProduct = { 
        producto_id,
        name, 
        description, 
        image, 
        basePrice: Number(price),
        sizes: parsedSizes,
        restaurant: restaurant,
        restaurante_id: restaurante_id
    };
    currentQty = 1;

    console.log('📊 currentProduct:', currentProduct);

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
    if (imgEl) {
        imgEl.src = image;
        imgEl.onerror = function() {
            this.src = 'assets/Img/basedatos.png';
        };
    }
    if (qtyEl) qtyEl.value = currentQty;
    if (notesEl) notesEl.value = '';

    // Actualizar opciones de tamaño
    if (sizesContainer && parsedSizes && Array.isArray(parsedSizes) && parsedSizes.length > 0) {
        console.log('📏 Renderizando tamaños:', parsedSizes.length);
        sizesContainer.innerHTML = '';
        
        parsedSizes.forEach((sizeObj, index) => {
            const sizeName = sizeObj.nombre_tamaño || sizeObj.name || 'Tamaño';
            const sizeMultiplier = parseFloat(sizeObj.multiplicador_precio) || 1;
            const sizePrice = currentProduct.basePrice * sizeMultiplier;
            
            console.log(`  ${index}: ${sizeName} - ${sizeMultiplier}x = S/ ${sizePrice}`);
            
            const div = document.createElement('div');
            div.className = 'form-check mb-2';
            div.innerHTML = `
                <input class="form-check-input" type="radio" name="size" 
                       id="size-${index}" value="${sizePrice}" 
                       ${index === 0 ? 'checked' : ''}>
                <label class="form-check-label w-100 p-2 border rounded" for="size-${index}" style="cursor: pointer; border-color: #dee2e6 !important; transition: all 0.3s;">
                    <strong>${sizeName}</strong> - S/ ${Number(sizePrice).toFixed(2)}
                </label>
            `;
            sizesContainer.appendChild(div);
            
            // Agregar evento para cambiar estilo cuando se selecciona
            const input = div.querySelector('input');
            const label = div.querySelector('label');
            input.addEventListener('change', () => {
                // Remover estilo de todos
                sizesContainer.querySelectorAll('label').forEach(lbl => {
                    lbl.style.backgroundColor = 'transparent';
                    lbl.style.borderColor = '#dee2e6';
                    lbl.style.borderWidth = '1px';
                });
                // Aplicar estilo al seleccionado
                if (input.checked) {
                    label.style.backgroundColor = '#e7f1ff';
                    label.style.borderColor = '#0d6efd';
                    label.style.borderWidth = '2px';
                }
            });
            
            // Si es el primero, aplicar estilo inicial
            if (index === 0) {
                label.style.backgroundColor = '#e7f1ff';
                label.style.borderColor = '#0d6efd';
                label.style.borderWidth = '2px';
            }
        });

        // Establecer precio inicial con el primer tamaño
        const firstMultiplier = parseFloat(parsedSizes[0].multiplicador_precio) || 1;
        const firstPrice = currentProduct.basePrice * firstMultiplier;
        currentProduct.basePrice = firstPrice;
        
        if (totalEl) {
            totalEl.textContent = currentProduct.basePrice.toFixed(2);
            console.log('✅ Total inicial:', currentProduct.basePrice.toFixed(2));
        }

        // Escuchar cambios de tamaño
        document.querySelectorAll('input[name="size"]').forEach(radio => {
            radio.onchange = () => {
                currentProduct.basePrice = Number(radio.value);
                updateModalTotal();
            };
        });
    } else {
        console.log('⚠️ Sin tamaños o no es array, usando precio base');
        if (totalEl) {
            totalEl.textContent = currentProduct.basePrice.toFixed(2);
            console.log('✅ Total (sin tamaños):', currentProduct.basePrice.toFixed(2));
        }
    }

    // Mostrar modal
    const modalEl = document.getElementById('productModal');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

function changeModalQuantity(delta) {
    const qtyEl = document.getElementById('modal-quantity');
    currentQty = Math.max(1, currentQty + delta);
    if (qtyEl) qtyEl.value = currentQty;
    updateModalTotal();
}

function updateModalTotal() {
    const totalEl = document.getElementById('modal-total-price');
    if (totalEl && currentProduct) {
        const total = currentProduct.basePrice * currentQty;
        totalEl.textContent = total.toFixed(2);
    }
}

function addFromModal() {
    if (!currentProduct) {
        console.error('❌ No hay producto seleccionado');
        return;
    }

    const notesEl = document.getElementById('product-notes');
    const notes = notesEl ? notesEl.value.trim() : '';
    
    const sizeRadio = document.querySelector('input[name="size"]:checked');
    const sizeLabel = sizeRadio ? sizeRadio.nextElementSibling.textContent.split(' - ')[0].trim() : 'Personal';
    
    const total = currentProduct.basePrice * currentQty;

    if (window.cart && typeof window.cart.addItem === 'function') {
        window.cart.addItem({
            producto_id: currentProduct.producto_id,
            name: currentProduct.name,
            price: currentProduct.basePrice,
            size: sizeLabel,
            quantity: currentQty,
            total: total,
            notes: notes,
            image: currentProduct.image,
            restaurant: currentProduct.restaurant || 'Restaurante',
            restaurante_id: currentProduct.restaurante_id
        });
        
        console.log('✅ Producto agregado al carrito:', currentProduct.name);
    } else {
        console.error('❌ carrito.js no está cargado correctamente');
        return;
    }

    // Mostrar notificación
    if (window.CartUtils && typeof window.CartUtils.showToast === 'function') {
        window.CartUtils.showToast('Producto agregado al carrito');
    } else {
        console.log('📢 Producto agregado al carrito');
    }

    // Cerrar modal
    const modalEl = document.getElementById('productModal');
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
}

function escapeForOnclick(str) {
    return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// ✅ Cerrar sesión (compatibilidad)
document.addEventListener("DOMContentLoaded", () => {
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            if (window.authManager && typeof window.authManager.logout === 'function') {
                window.authManager.logout();
            } else {
                // Fallback
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "index.html";
            }
        });
    }
});