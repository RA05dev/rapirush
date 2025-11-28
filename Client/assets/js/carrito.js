/**
 * carrito.js - Manejo del carrito de compras
 * RapiRush - Versión optimizada con eventos y cupones
 */

// Sistema de eventos global para el carrito
window.CartEvents = {
    listeners: [],
    
    onUpdate(callback) {
        this.listeners.push(callback);
    },
    
    emitUpdate() {
        const count = window.cart ? window.cart.getTotalItems() : 0;
        this.listeners.forEach(callback => {
            try {
                callback(count);
            } catch (error) {
                console.error('Error en listener del carrito:', error);
            }
        });
    },
    
    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }
};

// Clase para manejar el carrito
class ShoppingCart {
    constructor() {
        this.storageKey = 'cart';
        this.items = this.loadCart();
        this.initializeEventListeners();
    }

    // Inicializar event listeners
    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartCount();
            if (typeof loadCart === 'function') {
                loadCart();
            }
        });
    }

    // Cargar carrito desde localStorage
    loadCart() {
        try {
            const cart = localStorage.getItem(this.storageKey);
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            return [];
        }
    }

    // Guardar carrito en localStorage
    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
            this.updateCartCount();
            if (typeof loadCart === 'function') {
                loadCart();
            }
            this.updateOrderSummaryDirect();
            
            // ✅ EMITIR EVENTO GLOBAL DE ACTUALIZACIÓN
            window.CartEvents.emitUpdate();
            
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    }

    // Forzar actualización global
    forceGlobalUpdate() {
        this.updateCartCount();
        window.CartEvents.emitUpdate();
    }

    // Limpiar cupón después del pedido
    clearPromoCode() {
        localStorage.removeItem('promoCode');
        this.updateOrderSummaryDirect();
        console.log('✅ Cupón limpiado después del pedido');
    }

    // Agregar item al carrito
    addItem(product) {
        const existingItem = this.items.find(
            item => item.name === product.name && 
                    item.restaurant === product.restaurant &&
                    item.notes === product.notes
        );

        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                id: Date.now(),
                name: product.name,
                price: parseFloat(product.price),
                quantity: product.quantity || 1,
                image: product.image || 'https://via.placeholder.com/100',
                restaurant: typeof product.restaurant === 'string' ? product.restaurant : '',
                restaurante_id: product.restaurante_id || null,  // ← Guardar ID del restaurante
                notes: product.notes || ''
            });
        }

        this.saveCart();
        CartUtils.showToast('Producto agregado al carrito');
        return true;
    }

    // Actualizar cantidad de un item
    updateQuantity(index, change) {
        if (index >= 0 && index < this.items.length) {
            const item = this.items[index];
            const newQuantity = item.quantity + change;

            if (newQuantity <= 0) {
                this.removeItem(index);
            } else {
                item.quantity = newQuantity;
                this.updateOrderSummaryDirect();
                this.saveCart();
            }
        }
    }

    // Remover item del carrito
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.updateOrderSummaryDirect();
            this.saveCart();
            CartUtils.showToast('Producto eliminado', 'info');
        }
    }

    // Limpiar todo el carrito
    clearCart() {
        this.items = [];
        localStorage.removeItem(this.storageKey);
        this.updateCartCount();
        if (typeof loadCart === 'function') {
            loadCart();
        }
        window.CartEvents.emitUpdate();
    }

    // Obtener total de items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Obtener subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Obtener costo de delivery
    getDeliveryFee() {
        const subtotal = this.getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= 50) return 0;
        return 5.00;
    }

    // Obtener descuento
    getDiscount() {
        const promo = this.getActivePromo();
        if (!promo) return 0;
        
        if (promo.type === 'percentage') {
            return (this.getSubtotal() * promo.value) / 100;
        } else if (promo.type === 'fixed') {
            return promo.value;
        } else if (promo.type === 'delivery') {
            return this.getDeliveryFee();
        }
        return 0;
    }

    // Obtener total final
    getTotal() {
        return this.getSubtotal() + this.getDeliveryFee() - this.getDiscount();
    }

    // Actualizar contador en navbar
    updateCartCount() {
        const countElements = document.querySelectorAll('#cart-count, .cart-count');
        const count = this.getTotalItems();
        
        countElements.forEach(element => {
            if (element) {
                element.textContent = count;
            }
        });
    }

    // Actualizar resumen del pedido directo
    updateOrderSummaryDirect() {
        const elements = {
            subtotal: document.getElementById('subtotal'),
            deliveryFee: document.getElementById('delivery-fee'),
            discount: document.getElementById('discount'),
            total: document.getElementById('total')
        };

        if (!elements.subtotal) return;

        const subtotal = this.getSubtotal();
        const deliveryFee = this.getDeliveryFee();
        const discount = this.getDiscount();
        const total = subtotal + deliveryFee - discount;

        if (elements.subtotal) elements.subtotal.textContent = CartUtils.formatPrice(subtotal);
        if (elements.deliveryFee) elements.deliveryFee.textContent = CartUtils.formatPrice(deliveryFee);
        if (elements.discount) elements.discount.textContent = `- ${CartUtils.formatPrice(discount)}`;
        if (elements.total) elements.total.textContent = CartUtils.formatPrice(total);

        const emptyMessage = document.getElementById('empty-cart-message');
        const orderSummary = document.getElementById('order-summary');
        const continueShopping = document.getElementById('continue-shopping');

        if (this.items.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            if (orderSummary) orderSummary.style.display = 'none';
            if (continueShopping) continueShopping.style.display = 'none';
        } else {
            if (emptyMessage) emptyMessage.style.display = 'none';
            if (orderSummary) orderSummary.style.display = 'block';
            if (continueShopping) continueShopping.style.display = 'block';
        }
    }

    // Validar si el carrito está vacío
    isEmpty() {
        return this.items.length === 0;
    }

    // Obtener items del carrito
    getItems() {
        return this.items;
    }

    // Aplicar código promocional
    applyPromoCode(code) {
        const validCodes = {
            'DESCUENTO10': { type: 'percentage', value: 10, description: '10% de descuento' },
            'PRIMERACOMPRA': { type: 'fixed', value: 15, description: 'S/. 15 de descuento' },
            'DELIVERY0': { type: 'delivery', value: 0, description: 'Delivery gratis' }
        };

        const promo = validCodes[code.toUpperCase()];
        
        if (promo) {
            localStorage.setItem('promoCode', JSON.stringify({
                ...promo,
                code: code.toUpperCase(),
                appliedAt: new Date().toISOString()
            }));
            this.updateOrderSummaryDirect();
            return { success: true, promo };
        }

        return { success: false, message: 'Código inválido' };
    }

    // Obtener código promocional activo
    getActivePromo() {
        try {
            const promo = localStorage.getItem('promoCode');
            if (!promo) return null;
            
            const promoData = JSON.parse(promo);
            // Verificar si el cupón expiró (24 horas)
            const appliedAt = new Date(promoData.appliedAt);
            const now = new Date();
            const hoursDiff = (now - appliedAt) / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
                this.clearPromoCode();
                return null;
            }
            
            return promoData;
        } catch {
            this.clearPromoCode();
            return null;
        }
    }

    // Remover código promocional
    removePromo() {
        localStorage.removeItem('promoCode');
        this.updateOrderSummaryDirect();
    }
}

// Funciones de utilidad para animaciones y notificaciones
const CartUtils = {
    // Mostrar notificación toast
    showToast(message, type = 'success') {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '11';
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast-' + Date.now();
        const bgColor = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info';
        const icon = type === 'success' ? 'check-circle-fill' : type === 'error' ? 'x-circle-fill' : 'info-circle-fill';

        const toastHTML = `
            <div id="${toastId}" class="toast" role="alert">
                <div class="toast-header ${bgColor} text-white">
                    <i class="bi bi-${icon} me-2"></i>
                    <strong class="me-auto">${type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Información'}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();

        toastElement.addEventListener('hidden.bss.toast', () => {
            toastElement.remove();
        });
    },

    // Confirmar acción
    confirm(message, callback) {
        if (window.confirm(message)) {
            callback();
        }
    },

    // Formatear precio
    formatPrice(price) {
        return `S/. ${parseFloat(price).toFixed(2)}`;
    }
};

// Inicializar carrito global y hacerlo disponible
window.cart = new ShoppingCart();

// Función para verificar si el usuario está logueado
function checkUserAuth() {
    try {
        // Verificar si authManager está disponible y el usuario está logueado
        return window.authManager && window.authManager.isLoggedIn();
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return false;
    }
}

// Función para obtener información del usuario actual
function getCurrentUserInfo() {
    try {
        if (window.authManager && window.authManager.isLoggedIn()) {
            return window.authManager.getCurrentUser();
        }
        return null;
    } catch (error) {
        console.error('Error obteniendo información del usuario:', error);
        return null;
    }
}

// Función para mostrar modal de autenticación
// Función para mostrar modal de autenticación - VERSIÓN SIMPLIFICADA
function showAuthModal() {
    if (window.authManager && window.authManager.isLoggedIn()) {
        proceedToCheckout();
        return;
    }

    const modalHTML = `
        <div class="modal fade" id="authModal" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="authModalLabel">Inicia sesión para continuar</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <i class="bi bi-person-check display-4 text-primary mb-3"></i>
                        <p>Para realizar tu pedido necesitas tener una cuenta.</p>
                        <p class="text-muted small">¿No tienes cuenta? El registro es rápido y fácil.</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <a href="auth/login.html" class="btn btn-primary me-2" onclick="setRedirectAfterLogin()">
                            <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                        </a>
                        <a href="auth/register.html" class="btn btn-outline-primary">
                            <i class="bi bi-person-plus"></i> Crear Cuenta
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('authModal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const authModal = new bootstrap.Modal(document.getElementById('authModal'));
    authModal.show();

    document.getElementById('authModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

// Función para establecer redirección después del login
function setRedirectAfterLogin() {
    sessionStorage.setItem('redirectAfterLogin', 'checkout.html');
    console.log('📍 Redirección después de login: checkout.html');
}

// Función global para agregar al carrito
function addToCart(name, price, image, restaurant = 'Restaurante') {
    window.cart.addItem({
        name: name,
        price: price,
        image: image,
        restaurant: restaurant,
        quantity: 1
    });
}

// Función global para actualizar cantidad
function updateQuantity(index, change) {
    window.cart.updateQuantity(index, change);
}

// Función global para remover item
function removeItem(index) {
    CartUtils.confirm('¿Estás seguro de eliminar este producto?', () => {
        window.cart.removeItem(index);
    });
}

// Función para proceder al checkout
// Función para proceder al checkout - VERSIÓN CORREGIDA
function proceedToCheckout() {
    console.log('🛒 Procediendo al checkout...');
    
    if (window.cart.isEmpty()) {
        CartUtils.showToast('Tu carrito está vacío', 'error');
        return;
    }

    if (!checkUserAuth()) {
        console.log('❌ Usuario no autenticado, redirigiendo al login');
        CartUtils.showToast('Debes iniciar sesión para continuar con el pago', 'info');
        
        // ✅ RUTA SIMPLIFICADA - desde cualquier página
        sessionStorage.setItem('redirectAfterLogin', 'checkout.html');
        console.log('📍 Redirección guardada: checkout.html');
        
        // ✅ RUTA AL LOGIN DESDE CUALQUIER PÁGINA
        window.location.href = 'auth/login.html';
        return;
    }

    // ✅ RUTA DIRECTA AL CHECKOUT
    console.log('✅ Usuario autenticado, redirigiendo a checkout.html');
    window.location.href = 'checkout.html';
}


// Función para cargar y mostrar items del carrito
function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (!cartItemsContainer) return;

    const items = window.cart.getItems();

    if (items.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-5" id="empty-cart-message">
                <i class="bi bi-cart-x display-1 text-muted"></i>
                <h4 class="mt-3">Tu carrito está vacío</h4>
                <p class="text-muted">Agrega productos de tus restaurantes favoritos</p>
                <a href="restaurantes.html" class="btn btn-primary mt-3">
                    <i class="bi bi-shop"></i> Explorar restaurantes
                </a>
            </div>
        `;
        return;
    }

    let itemsHTML = '';
    items.forEach((item, index) => {
        itemsHTML += `
            <div class="cart-item" data-index="${index}">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image || 'https://tse2.mm.bing.net/th/id/OIP.bOHXXwMeoH4f0ur86eCL3AHaEK?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'}" 
                             class="img-fluid rounded" alt="${item.name}">
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">${item.restaurant || ''}</small>
                        ${item.notes ? `<p class="text-muted small mt-1"><i class="bi bi-card-text"></i> ${item.notes}</p>` : ''}
                    </div>
                    <div class="col-md-2 text-center">
                        <p class="mb-0 fw-bold">${CartUtils.formatPrice(item.price)}</p>
                    </div>
                    <div class="col-md-2">
                        <div class="quantity-control">
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">
                                <i class="bi bi-dash"></i>
                            </button>
                            <span class="fw-bold">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 text-end">
                        <p class="mb-0 fw-bold text-primary">${CartUtils.formatPrice(item.price * item.quantity)}</p>
                        <button class="btn btn-sm btn-link text-danger p-0" onclick="removeItem(${index})">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
                <hr class="my-3">
            </div>
        `;
    });

    cartItemsContainer.innerHTML = itemsHTML;
    window.cart.updateOrderSummaryDirect();
}

// Función para aplicar código promocional
function applyPromoCode() {
    const promoCode = document.getElementById('promo-code').value;
    const promoMessage = document.getElementById('promo-message');
    
    if (!promoCode) return;

    const result = window.cart.applyPromoCode(promoCode);
    
    if (result.success) {
        promoMessage.textContent = `¡Código aplicado! ${result.promo.description}`;
        promoMessage.className = 'text-success';
        CartUtils.showToast('Código promocional aplicado correctamente', 'success');
        window.cart.updateOrderSummaryDirect();
    } else {
        promoMessage.textContent = result.message;
        promoMessage.className = 'text-danger';
        CartUtils.showToast('Código promocional inválido', 'error');
    }
    promoMessage.style.display = 'block';
}

// Cargar carrito al iniciar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛒 Inicializando carrito...');
    
    // Verificar que authManager esté disponible
    if (!window.authManager) {
        console.warn('⚠️ AuthManager no disponible, cargando scripts...');
        // Podrías cargar authManager aquí si es necesario
    }
    
    if (typeof loadCart === 'function') {
        loadCart();
    }
    
    window.cart.updateCartCount();
    
    // Mostrar información de debug
    const user = getCurrentUserInfo();
    if (user) {
        console.log('✅ Usuario autenticado en carrito:', user.email);
    } else {
        console.log('❌ Usuario NO autenticado en carrito');
    }
});