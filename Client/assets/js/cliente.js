// ==============================
// cliente.js – Panel del cliente (CORREGIDO)
// ==============================
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Iniciando dashboard cliente...');
  
  // ✅ ESPERAR a que authManager esté listo
  if (window.authManager && typeof window.authManager.isReady === 'function') {
    await window.authManager.isReady();
    console.log('✅ authManager está listo');
  }
  
  console.log('📦 authManager:', !!window.authManager);
  console.log('🔍 isLoggedIn():', window.authManager?.isLoggedIn());
  console.log('👤 currentUser:', window.authManager?.getCurrentUser());
  
  // ✅ USAR authManager en lugar de sessionStorage viejo
  if (!window.authManager || !authManager.isLoggedIn()) {
    console.log('❌ No hay sesión en authManager, redirigiendo...');
    console.log('💾 localStorage.currentUser:', localStorage.getItem('currentUser'));
    console.log('💾 localStorage.token:', localStorage.getItem('supabaseAuthToken')?.substring(0, 20) + '...');
    window.location.href = '../auth/login.html';
    return;
  }

  const user = authManager.getCurrentUser();
  console.log('👤 Usuario obtenido:', user);
  
  // ✅ VERIFICAR que sea cliente
  if (user.role !== 'cliente') {
    console.log(`❌ Rol incorrecto: ${user.role}, redirigiendo...`);
    window.location.href = authManager.getDashboardUrl();
    return;
  }

  console.log('✅ Sesión válida, mostrando dashboard cliente');

  // ✅ INICIALIZAR INTERFAZ
  initializeUI(user);
  initializeCart();
  loadOrders(user);
  computeStats(user);
});

// ==============================
// 🔹 INICIALIZAR INTERFAZ
// ==============================
function initializeUI(user) {
  console.log('🎨 Inicializando UI...');
  
  // Llenar datos del perfil
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userNameSidebar').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;

  // Configurar formulario de perfil
  document.getElementById('profileFullName').value = user.name;
  document.getElementById('profileEmail').value = user.email;
  document.getElementById('profilePhone').value = user.phone || '';

  // Configurar logout
  const logoutBtn = document.getElementById('btnLogout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogout();
    });
  }

  // Configurar guardar perfil
  const saveProfileBtn = document.getElementById('btnSaveProfile');
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', handleSaveProfile);
  }
}

// ==============================
// 🔹 MANEJAR LOGOUT
// ==============================
function handleLogout() {
  console.log('🔒 Cerrando sesión...');
  
  // ✅ USAR authManager para logout
  if (window.authManager) {
    authManager.logout();
  } else {
    // Fallback
    window.location.href = '../auth/login.html';
  }
}

// ==============================
// 🔹 MANEJAR GUARDAR PERFIL
// ==============================
function handleSaveProfile() {
  const newName = document.getElementById('profileFullName').value;
  const newPhone = document.getElementById('profilePhone').value;
  
  console.log('💾 Guardando perfil:', { newName, newPhone });
  
  // Actualizar sessionStorage
  sessionStorage.setItem('user_name', newName);
  
  // Aquí luego llamarás a la API para guardar en la base de datos
  alert('Perfil actualizado correctamente');
  
  // Actualizar UI
  document.getElementById('userName').textContent = newName;
  document.getElementById('userNameSidebar').textContent = newName;
  
  // Cerrar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
  if (modal) modal.hide();
}

// ==============================
// 🔹 INICIALIZAR CARRITO
// ==============================
function initializeCart() {
  console.log('🛒 Inicializando carrito...');
  
  // Actualizar inmediatamente
  if (window.cart && typeof window.cart.updateCartCount === 'function') {
    window.cart.updateCartCount();
  }
  
  // Escuchar eventos futuros
  if (window.CartEvents) {
    window.CartEvents.onUpdate(function(count) {
      const cartCountElements = document.querySelectorAll('#cart-count, .cart-count');
      cartCountElements.forEach(element => {
        if (element) element.textContent = count;
      });
    });
  }
}

// ==============================
// 🔹 CARGAR PEDIDOS
// ==============================
let currentUserOrders = [];  // ← Variable global para guardar pedidos
async function loadOrders(user) {
  console.log('📦 Cargando pedidos...');
  
  const ACTIVE_STATES = ['recibido', 'preparando', 'camino', 'listo', 'camino', 'llegado'];
  
  let orders = [];

  try {
    // ✅ INTENTAR OBTENER DE LA BASE DE DATOS PRIMERO
    console.log('🔄 Intentando obtener pedidos de la base de datos...');
    const result = await window.rapiRushAPI.getMyOrders();
    
    if (result && result.orders) {
      orders = result.orders.map(dbOrder => ({
        id: dbOrder.id,
        numero: `#${dbOrder.id.toString().slice(-6)}`,
        date: dbOrder.creado_en,
        // ✅ MAPEAR ITEMS CORRECTAMENTE DEL BACKEND
        items: (dbOrder.pedido_detalle || []).map(item => ({
          name: item.nombre_item,
          quantity: item.cantidad,
          price: item.precio,
          description: item.descripcion || '',
          note: item.nota_producto || ''
        })),
        subtotal: dbOrder.subtotal,
        delivery: dbOrder.delivery_fee,
        discount: dbOrder.descuento,
        total: dbOrder.total,
        status: dbOrder.estado,
        email: dbOrder.cliente_email,
        name: dbOrder.cliente_nombre,
        deliveryAddress: dbOrder.direccion_entrega,
        district: dbOrder.distrito_entrega,
        deliveryNote: dbOrder.nota_repartidor,
        paymentMethod: dbOrder.metodo_pago
      }));
      console.log(`✅ ${orders.length} pedidos obtenidos de la base de datos`);
    }
  } catch (error) {
    console.warn('⚠️ Error obteniendo pedidos de BD, usando localStorage:', error);
    // ✅ FALLBACK A LOCALSTORAGE
    orders = window.Session && window.Session.getOrders ? 
      window.Session.getOrders(user.email) : [];
  }

  const activosContainer = document.getElementById('pedidosActivosList');
  const historialContainer = document.getElementById('historialPedidosList');
  
  activosContainer.innerHTML = '';
  historialContainer.innerHTML = '';

  if (!orders || orders.length === 0) {
    activosContainer.innerHTML = '<div class="text-muted text-center py-3">No hay pedidos activos</div>';
    historialContainer.innerHTML = '<div class="text-muted text-center py-3">Todavía no tienes historial de pedidos</div>';
    currentUserOrders = [];  // ← Guardar lista vacía
    computeStats(currentUserOrders);  // ← Actualizar estadísticas
    return;
  }

  // ← GUARDAR PEDIDOS PARA USAR EN ESTADÍSTICAS
  currentUserOrders = orders;
  
  orders.forEach(function(order) {
    renderOrderItem(order, activosContainer, historialContainer, ACTIVE_STATES);
  });
}


// ==============================
// 🔹 MOSTRAR DETALLES DE PEDIDO
// ==============================
function showOrderDetails(order) {
  const detalleBody = document.getElementById('detallePedidoBody');
  detalleBody.innerHTML = '';
  
  let html = `
    <div class="mb-4">
      <h5 class="fw-bold">Pedido #${order.id.substring(0, 8)}</h5>
      <p class="mb-1"><strong>Fecha:</strong> ${new Date(order.date).toLocaleString()}</p>
      <p class="mb-1"><strong>Total:</strong> S/. ${order.total?.toFixed?.(2) || '0.00'}</p>
      <p class="mb-0"><strong>Estado:</strong> <span class="badge bg-primary">${order.status}</span></p>
    </div>
    
    <hr>
    
    <h6 class="fw-bold mb-3">📦 Items del Pedido</h6>
    <div class="list-group">`;
  
  // Mostrar cada producto con su nota individual
  (order.items || []).forEach(item => {
    html += `
      <div class="list-group-item">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <div class="fw-bold">${item.quantity}x ${item.name}</div>
            ${item.note ? `<small class="text-muted d-block mt-1">📝 <em>"${item.note}"</em></small>` : ''}
            ${item.description ? `<small class="text-muted d-block">${item.description}</small>` : ''}
          </div>
          <div class="text-end">
            <div class="fw-bold">S/. ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
            ${item.originalPrice && item.originalPrice !== item.price ? 
              `<small class="text-muted text-decoration-line-through">S/. ${(item.originalPrice * (item.quantity || 1)).toFixed(2)}</small>` : ''}
          </div>
        </div>
      </div>`;
  });
  
  html += `</div>`;
  
  // Mostrar información de entrega si está disponible
  if (order.deliveryAddress || order.deliveryNote || order.referencia_entrega || order.reference) {
    html += `
      <hr>
      <h6 class="fw-bold mb-3">🏠 Información de Entrega</h6>
      <div class="card bg-light">
        <div class="card-body">
          ${order.deliveryAddress ? `<p class="mb-1"><strong>Dirección:</strong> ${order.deliveryAddress}</p>` : ''}
          ${order.district ? `<p class="mb-1"><strong>Distrito:</strong> ${order.district}</p>` : ''}
          ${order.referencia_entrega || order.reference ? `<p class="mb-1"><strong>Referencia:</strong> ${order.referencia_entrega || order.reference}</p>` : ''}
          ${order.deliveryNote ? `<p class="mb-0"><strong>Nota para repartidor:</strong> ${order.deliveryNote}</p>` : ''}
        </div>
      </div>`;
  }
  
  detalleBody.innerHTML = html;

  const detalleModal = new bootstrap.Modal(document.getElementById('detallePedidoModal'));
  detalleModal.show();
}

// ==============================
// 🔹 MOSTRAR RASTREO - VERSIÓN MEJORADA
// ==============================
function showTracking(order) {
  const rastrearBody = document.getElementById('rastrearPedidoBody');
  rastrearBody.innerHTML = '';
  
  let html = '';
  
  // Información de entrega para el repartidor
  html += `
    <div class="card mb-4 border-primary">
      <div class="card-header bg-primary text-white">
        <h6 class="mb-0">🏠 Información de Entrega</h6>
      </div>
      <div class="card-body">
        ${order.deliveryAddress ? `<p class="mb-2"><strong>📍 Dirección:</strong><br>${order.deliveryAddress}</p>` : ''}
        ${order.district ? `<p class="mb-2"><strong>🗺️ Distrito:</strong> ${order.district}</p>` : ''}
        ${order.referencia_entrega || order.reference ? `<p class="mb-2"><strong>🔑 Referencia:</strong> ${order.referencia_entrega || order.reference}</p>` : ''}
        ${order.deliveryNote ? `<p class="mb-0"><strong>📝 Nota para repartidor:</strong><br><em>"${order.deliveryNote}"</em></p>` : ''}
      </div>
    </div>`;
  
  // Timeline de seguimiento
  const steps = order.tracking || getDefaultTrackingSteps(order);
  
  if (String(order.status).toLowerCase() === 'entregado') {
    html += `<div class="alert alert-success text-center fw-bold mb-4">✅ Tu pedido fue entregado correctamente.</div>`;
  } else if (String(order.status).toLowerCase() === 'llegado') {
    html += `<div class="alert alert-info text-center fw-bold mb-4">🚚 Tu pedido ha llegado al destino. Confirma cuando lo recibas.</div>`;
  }
  
  html += '<h6 class="fw-bold mb-3">📋 Seguimiento del Pedido</h6>';
  html += '<div class="timeline">';
  
  steps.forEach((step, index) => {
    const isCompleted = index <= steps.findIndex(s => s.step === order.status) || step.completed;
    const isCurrent = step.step === order.status;
    
    html += `
      <div class="d-flex align-items-start mb-3">
        <div class="me-3" style="width:40px; text-align:center;">
          <i class="bi ${isCompleted ? 'bi-check-circle-fill text-success' : (isCurrent ? 'bi-arrow-right-circle-fill text-warning' : 'bi-circle text-muted')} fs-5"></i>
        </div>
        <div class="flex-grow-1">
          <div class="${isCompleted ? 'fw-bold' : (isCurrent ? 'fw-bold text-warning' : 'text-muted')}">
            ${step.step}
            ${isCurrent ? ' <span class="badge bg-warning text-dark">Actual</span>' : ''}
          </div>
          <small class="text-muted d-block">${step.description || ''}</small>
          ${step.time ? `<small class="text-muted">${new Date(step.time).toLocaleString()}</small>` : ''}
        </div>
      </div>`;
  });
  
  html += '</div>';
  
  rastrearBody.innerHTML = html;
  new bootstrap.Modal(document.getElementById('rastrearPedidoModal')).show();
}
// ==============================
// 🔹 OBTENER ESTADOS DE SEGUIMIENTO POR DEFECTO
// ==============================
function getDefaultTrackingSteps(order) {
  const baseSteps = [
    { step: 'Pedido recibido', description: 'Hemos recibido tu pedido', time: order.date },
    { step: 'Aceptado por el restaurante', description: 'Aceptado por el restaurante' },
    { step: 'En preparación', description: 'En preparación' },
    { step: 'En camino', description: 'En camino' },
    { step: 'Pedido llegado al destino', description: 'Pedido llegado al destino' },
    { step: 'Entregado', description: 'Entregado' }
  ];
  
  return baseSteps;
}

// ==============================
// 🔹 RENDERIZAR ITEM DE PEDIDO - VERSIÓN MEJORADA
// ==============================
function renderOrderItem(order, activosContainer, historialContainer, ACTIVE_STATES) {
  const item = document.createElement('a');
  item.className = 'list-group-item list-group-item-action';
  item.href = '#';
  item.dataset.orderId = order.id;
  
  // Resumen de productos
  const itemsSummary = (order.items || [])
    .slice(0, 2)
    .map(item => `${item.quantity}x ${item.name}`)
    .join(', ');
  
  const remainingItems = (order.items || []).length - 2;
  const itemsDisplay = remainingItems > 0 ? 
    `${itemsSummary} y ${remainingItems} más...` : itemsSummary;
  
  item.innerHTML = `
    <div class="d-flex w-100 justify-content-between">
      <h6 class="mb-1">Pedido #${order.id.substring(0, 8)} - S/. ${order.total?.toFixed?.(2) || '0.00'}</h6>
      <small>${new Date(order.date).toLocaleString()}</small>
    </div>
    <p class="mb-1 small">${itemsSummary || 'No hay items'}</p>
    <p class="mb-1 small text-muted">Estado: <span class="badge bg-primary">${order.status}</span></p>
  `;

  item.addEventListener('click', function(e) {
    e.preventDefault();
    showOrderDetails(order);
  });

  const isActive = ACTIVE_STATES.includes(String(order.status).toLowerCase());
  
  const trackBtn = document.createElement('button');
  trackBtn.className = 'btn btn-sm btn-outline-primary';
  trackBtn.textContent = isActive ? '🚚 Rastrear' : '📋 Ver detalles';
  trackBtn.addEventListener('click', e => {
    e.preventDefault(); 
    e.stopPropagation();
    if (isActive) {
      showTracking(order);
    } else {
      showOrderDetails(order);
    }
  });

  const btnWrap = document.createElement('div');
  btnWrap.className = 'mt-2 d-flex justify-content-end gap-2';
  btnWrap.appendChild(trackBtn);

  // ✅ AGREGAR BOTONES ADICIONALES SEGÚN EL ESTADO
  if (isActive) {
    // Botón para cancelar si está recibido
    if (String(order.status).toLowerCase() === 'recibido') {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn btn-sm btn-danger';
      cancelBtn.innerHTML = '<i class="bi bi-x-circle"></i> Cancelar';
      cancelBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        cancelOrder(order.id);
      });
      btnWrap.appendChild(cancelBtn);
    }

    // Botón para confirmar entrega si está llegado
    if (String(order.status).toLowerCase() === 'llegado') {
      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'btn btn-sm btn-success';
      confirmBtn.innerHTML = '<i class="bi bi-check-circle"></i> Confirmar entrega';
      confirmBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        confirmDelivery(order.id);
      });
      btnWrap.appendChild(confirmBtn);
    }
  }

  item.appendChild(btnWrap);

  if (isActive) {
    activosContainer.appendChild(item);
  } else {
    historialContainer.appendChild(item);
  }
}

// ==============================
// 🔹 CALCULAR ESTADÍSTICAS
// ==============================
function computeStats(orders = currentUserOrders) {
  console.log('📊 Calculando estadísticas con', orders.length, 'pedidos');
  
  const total = orders.length;
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  
  let spentThisMonth = 0;
  let totalSpentAllTime = 0;

  orders.forEach(order => {
    const orderDate = new Date(order.date || order.creado_en);
    const amount = Number(order.total) || 0;
    
    totalSpentAllTime += amount;
    if (orderDate.getMonth() === month && orderDate.getFullYear() === year) {
      spentThisMonth += amount;
    }
  });

  // ✅ 1 SOL = 1 PUNTO
  const points = Math.floor(totalSpentAllTime);
  
  document.getElementById('totalOrdersCount').textContent = total;
  document.getElementById('spentThisMonth').textContent = spentThisMonth.toFixed(2);
  document.getElementById('userPoints').textContent = points;
  
  console.log('📊 Estadísticas actualizadas:', { total, spentThisMonth, points });
}

// ==============================
// 🔹 CANCELAR PEDIDO
// ==============================
async function cancelOrder(orderId) {
  const confirmed = confirm('¿Estás seguro de que deseas cancelar este pedido?');
  if (!confirmed) return;

  try {
    console.log('❌ Cancelando pedido:', orderId);
    
    // Llamar a API para cancelar
    const response = await window.rapiRushAPI.updateOrderStatus(orderId, 'cancelado');
    
    if (response.success) {
      alert('Pedido cancelado exitosamente');
      // Recargar pedidos
      const user = authManager.getCurrentUser();
      await loadOrders(user);
      computeStats(currentUserOrders);  // ← Actualizar estadísticas
    } else {
      alert('Error al cancelar: ' + (response.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('❌ Error cancelando pedido:', error);
    alert('Error al cancelar el pedido');
  }
}

// ==============================
// 🔹 CONFIRMAR ENTREGA
// ==============================
async function confirmDelivery(orderId) {
  const confirmed = confirm('¿Confirmas que recibiste tu pedido correctamente?');
  if (!confirmed) return;

  try {
    console.log('✅ Confirmando entrega:', orderId);
    
    // Llamar a API para marcar como entregado
    const response = await window.rapiRushAPI.updateOrderStatus(orderId, 'entregado');
    
    if (response.success) {
      alert('¡Gracias por tu compra! Pedido marcado como entregado.');
      // Recargar pedidos
      const user = authManager.getCurrentUser();
      await loadOrders(user);
      computeStats(currentUserOrders);  // ← Actualizar estadísticas
    } else {
      alert('Error al confirmar: ' + (response.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('❌ Error confirmando entrega:', error);
    alert('Error al confirmar la entrega');
  }
}