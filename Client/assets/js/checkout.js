// checkout.js - VERSIÓN MEJORADA con verificación de sesión

// 🔐 VERIFICAR SESIÓN AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Iniciando checkout...');
    checkAuthStatus();
    loadOrderSummary();
    setupEventListeners();
});

// Función para verificar autenticación
function checkAuthStatus() {
    try {
        console.log('🔐 Verificando estado de autenticación...');
        
        // Verificar si authManager está disponible
        if (!window.authManager) {
            console.error('❌ AuthManager no disponible');
            redirectToLogin();
            return;
        }

        // Verificar si el usuario está logueado
        if (!authManager.isLoggedIn()) {
            console.warn('⚠️ Usuario no autenticado');
            redirectToLogin();
            return;
        }

        // ✅ VERIFICACIÓN ADICIONAL: Comprobar que el token es válido
        const token = localStorage.getItem('supabaseAuthToken');
        if (!token) {
            console.warn('⚠️ No hay token en localStorage');
            redirectToLogin();
            return;
        }

        const user = authManager.getCurrentUser();
        console.log('✅ Usuario autenticado:', user.email);
        
        // Prellenar datos del usuario en el formulario
        prefillUserData(user);
        
    } catch (error) {
        console.error('❌ Error verificando autenticación:', error);
        redirectToLogin();
    }
}

function redirectToLogin() {
    console.log('🔄 Redirigiendo al login...');
    // Guardar la página actual para regresar después del login
    sessionStorage.setItem('redirectAfterLogin', 'checkout.html');
    
    // ✅ RUTA CORRECTA desde checkout.html al login
    window.location.href = 'auth/login.html';
}
function prefillUserData(user) {
    console.log('📝 Prellenando datos del usuario...');
    
    if (user.name && document.getElementById('firstName')) {
        document.getElementById('firstName').value = user.name;
    }
    
    // Si hay más datos del usuario, prellenarlos
    if (user.phone && document.getElementById('phone')) {
        document.getElementById('phone').value = user.phone;
    }
    
    if (user.address && document.getElementById('address')) {
        document.getElementById('address').value = user.address;
    }
}

function setupEventListeners() {
    // Mostrar/ocultar sección de tarjeta
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const cardSection = document.getElementById('card-details-section');
            if (this.value === 'card') {
                cardSection.style.display = 'block';
            } else {
                cardSection.style.display = 'none';
            }
        });
    });

    // Formatear número de tarjeta
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Formatear fecha de expiración
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
}

// Cargar resumen del pedido
function loadOrderSummary() {
    console.log('🛒 Cargando resumen del pedido...');
    
    // 🔐 Verificar nuevamente la sesión
    if (!authManager || !authManager.isLoggedIn()) {
        console.warn('❌ Sesión perdida al cargar resumen');
        redirectToLogin();
        return;
    }

    const cart = window.cart ? window.cart.getItems() : [];
    
    if (cart.length === 0) {
        console.warn('🛒 Carrito vacío, redirigiendo...');
        window.location.href = 'carrito.html';
        return;
    }

    const itemsList = document.getElementById('order-items-list');
    let itemsHTML = '';
    
    cart.forEach(item => {
        itemsHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                    <span class="badge bg-secondary me-2">${item.quantity}x</span>
                    <span class="small">${item.name}</span>
                </div>
                <span class="small fw-bold">S/. ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    itemsList.innerHTML = itemsHTML;

    const subtotal = window.cart ? window.cart.getSubtotal() : 0;
    const deliveryFee = window.cart ? window.cart.getDeliveryFee() : 0;
    const discount = window.cart ? window.cart.getDiscount() : 0;
    const total = subtotal + deliveryFee - discount;

    document.getElementById('summary-subtotal').textContent = `S/. ${subtotal.toFixed(2)}`;
    document.getElementById('summary-delivery').textContent = `S/. ${deliveryFee.toFixed(2)}`;
    document.getElementById('summary-discount').textContent = `- S/. ${discount.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `S/. ${total.toFixed(2)}`;
    
    console.log('✅ Resumen cargado - Total: S/.', total.toFixed(2));
}

// Confirmar pedido
async function confirmOrder() {
    console.log('✅ Confirmando pedido...');
    
    // 🔐 Verificar sesión antes de confirmar
    if (!authManager || !authManager.isLoggedIn()) {
        alert('Por favor inicia sesión para continuar con tu pedido');
        redirectToLogin();
        return;
    }

    const form = document.getElementById('checkout-form');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardName = document.getElementById('cardName').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;
        
        if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
            alert('Por favor completa todos los datos de la tarjeta');
            return;
        }
    }

    // Mostrar loading
    const confirmBtn = document.querySelector('.btn-primary');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="bi bi-arrow-repeat spinner"></i> Procesando...';
    confirmBtn.disabled = true;

    try {
        const cart = window.cart.getItems();
        const subtotal = window.cart.getSubtotal();
        const deliveryFee = window.cart.getDeliveryFee();
        const discount = window.cart.getDiscount();
        const total = subtotal + deliveryFee - discount;

        const user = authManager.getCurrentUser();

        // ✅ DATOS PARA LA BASE DE DATOS
        const customerName = document.getElementById('firstName').value;
        const direccionCompleta = document.getElementById('address').value + ', ' + document.getElementById('district').value;
        const notes = document.getElementById('notes').value;
        const reference = document.getElementById('reference').value;

        // Agregar notas como item adicional si existen
        const cartConNotas = [...cart];
        if (notes || reference) {
            let notaTexto = '';
            if (notes) notaTexto += `Notas: ${notes}`;
            if (reference) notaTexto += (notaTexto ? ' | ' : '') + `Referencia: ${reference}`;
            
            cartConNotas.push({
                name: '📝 Información adicional',
                price: 0,
                quantity: 1,
                notes: notaTexto,
                restaurant: 'Sistema'
            });
        }

        const orderData = {
            items: cartConNotas,
            subtotal: subtotal,
            delivery: deliveryFee,
            discount: discount,
            total: total,
            address: direccionCompleta,  // ← Dirección completa (calle + distrito)
            phone: document.getElementById('phone').value,
            customerName: customerName,  // ← Solo nombres (ya es campo completo)
            paymentMethod: paymentMethod
        };

        console.log('📦 Enviando pedido a servidor...', orderData);

        // ✅ GUARDAR EN LA BASE DE DATOS
        const result = await window.rapiRushAPI.createOrder(orderData);
        
        const orderNumber = result.order.numero;
        document.getElementById('order-number').textContent = orderNumber;

        console.log('✅ Pedido guardado en base de datos:', result.order.id);

        // ✅ TAMBIÉN GUARDAR EN LOCALSTORAGE (para compatibilidad)
        const localOrder = {
            id: result.order.id,
            numero: orderNumber,
            date: new Date().toISOString(),
            items: cart,
            subtotal: subtotal,
            delivery: deliveryFee,
            discount: discount,
            total: total,
            status: 'pendiente',
            email: user.email,
            name: user.name,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            district: document.getElementById('district').value,
            paymentMethod: paymentMethod
        };

        // Guardar en localStorage también
        const key = 'orders_' + user.email.toLowerCase();
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift(localOrder);
        localStorage.setItem(key, JSON.stringify(existing));

        // ✅ LIMPIAR CUPÓN Y CARRITO
        window.cart.clearPromoCode();
        window.cart.clearCart();
        
        console.log('✅ Pedido procesado exitosamente');

        // Mostrar modal de confirmación
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();

    } catch(error) {
        console.error('❌ Error procesando pedido:', error);
        alert('Error al procesar el pedido: ' + error.message);
        return;
    } finally {
        // Restaurar botón
        confirmBtn.innerHTML = originalText;
        confirmBtn.disabled = false;
    }
}