// ==============================
// cliente.js – Panel del cliente (CORREGIDO)
// ==============================

// ✅ FUNCIÓN PRINCIPAL QUE SE EJECUTA CUANDO EL DOM ESTÁ LISTO
async function initDashboard() {
  console.log('🚀 Iniciando dashboard cliente...');
  
  // ✅ ESPERAR a que authManager esté listo
  if (window.authManager && typeof window.authManager.isReady === 'function') {
    await window.authManager.isReady();
    console.log('✅ authManager está listo');
  }
  
  console.log('📦 Verificación de estado:');
  console.log('   - authManager existe:', !!window.authManager);
  console.log('   - isLoggedIn():', window.authManager?.isLoggedIn());
  console.log('   - currentUser:', window.authManager?.getCurrentUser());
  console.log('   - localStorage.currentUser:', localStorage.getItem('currentUser')?.substring(0, 50) + '...');
  console.log('   - localStorage.supabaseAuthToken:', !!localStorage.getItem('supabaseAuthToken'));
  
  // ✅ USAR authManager en lugar de sessionStorage viejo
  if (!window.authManager || !authManager.isLoggedIn()) {
    console.log('❌ No hay sesión en authManager, redirigiendo...');
    console.log('💾 localStorage.currentUser:', localStorage.getItem('currentUser'));
    console.log('💾 localStorage.token:', localStorage.getItem('supabaseAuthToken')?.substring(0, 20) + '...');
    
  // ✅ MEJORA: Verificación más detallada
  setTimeout(() => {
    if (!window.authManager || !authManager.isLoggedIn()) {
      console.log('🔴 Confirmado: Sin sesión válida. Redirigiendo a login.');
      console.log('📊 Estado final:', {
        authManager: !!window.authManager,
        isLoggedIn: window.authManager?.isLoggedIn?.(),
        currentUser: window.authManager?.getCurrentUser?.(),
        token: localStorage.getItem('supabaseAuthToken')?.substring(0, 10) + '...'
      });
      window.location.href = '../auth/login.html';
    }
  }, 500);
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
  console.log('🎨 ANTES de initializeUI');
  initializeUI(user);
  console.log('🎨 DESPUÉS de initializeUI');
  
  initializeCart();
  console.log('🎨 DESPUÉS de initializeCart');
  
  // ✅ CRÍTICO: Esperar a que rapiRushAPI esté configurado con token
  console.log('🔐 Esperando a que rapiRushAPI esté configurado...');
  await new Promise(resolve => {
    const checkInterval = setInterval(() => {
      if (window.rapiRushAPI && window.rapiRushAPI.token) {
        console.log('✅ Token configurado en rapiRushAPI, longitud:', window.rapiRushAPI.token.length);
        clearInterval(checkInterval);
        resolve();
      }
    }, 50);
    // Timeout después de 3 segundos
    setTimeout(() => {
      clearInterval(checkInterval);
      console.warn('⚠️ Timeout esperando token, continuando de todas formas');
      resolve();
    }, 3000);
  });
  
  console.log('🎨 ANTES de loadOrders');
  await loadOrders(user);
  console.log('🎨 DESPUÉS de loadOrders');
  
  computeStats(currentUserOrders);
}

// ✅ EJECUTAR CUANDO EL DOCUMENTO ESTÉ LISTO
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  // El documento ya está listo, ejecutar inmediatamente
  initDashboard();
}

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
  // ✅ NOTA: El logout ahora se maneja via onclick en el HTML
  console.log('✅ Cliente.js inicializado - logout disponible via onclick');

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
  console.log('🔍 window.rapiRushAPI existe?', !!window.rapiRushAPI);
  console.log('🔍 getMyOrders existe?', typeof window.rapiRushAPI?.getMyOrders);
  console.log('🔐 Token en rapiRushAPI?', !!window.rapiRushAPI?.token);
  console.log('🔐 Token válido?', window.rapiRushAPI?.token?.substring(0, 20) + '...');
  
  const ACTIVE_STATES = ['recibido', 'preparando', 'camino', 'listo', 'llegado'];
  
  let orders = [];

  try {
    // ✅ INTENTAR OBTENER DE LA BASE DE DATOS PRIMERO
    console.log('🔄 Intentando obtener pedidos de la base de datos...');
    
    if (!window.rapiRushAPI) {
      throw new Error('rapiRushAPI no está disponible');
    }
    
    if (typeof window.rapiRushAPI.getMyOrders !== 'function') {
      throw new Error('rapiRushAPI.getMyOrders no es una función');
    }
    
    if (!window.rapiRushAPI.token) {
      throw new Error('⚠️ CRÍTICO: Token no configurado en rapiRushAPI');
    }
    
    console.log('📤 Llamando a getMyOrders con token:', window.rapiRushAPI.token.substring(0, 20) + '...');
    const result = await window.rapiRushAPI.getMyOrders();
    
    console.log('📊 Resultado completo del API:', JSON.stringify(result, null, 2));
    console.log('📊 result.orders es:', result?.orders);
    console.log('📊 ¿Es array?', Array.isArray(result?.orders));
    console.log('📊 Longitud:', result?.orders?.length);
    
    if (!result.success) {
      console.warn('⚠️ API retornó success=false:', result.error);
    }
    
    if (result && result.orders && Array.isArray(result.orders)) {
      orders = result.orders.map(dbOrder => ({
        id: dbOrder.pedido_id,
        numero: dbOrder.numero_pedido,
        date: dbOrder.fecha_creacion,
        // ✅ MAPEAR ITEMS CORRECTAMENTE DEL BACKEND
        items: (dbOrder.tb_pedido_detalles || []).map(item => ({
          name: item.nombre_producto,
          quantity: item.cantidad,
          price: item.precio_unitario,
          description: item.descripcion || '',
          note: item.notas_adicionales || ''
        })),
        subtotal: dbOrder.subtotal,
        delivery: dbOrder.costo_envio,
        discount: 0,  // No hay campo descuento en BD, pero puede agregarse después
        total: dbOrder.total,
        status: dbOrder.estado,
        name: dbOrder.nombre_cliente,
        phone: dbOrder.telefono_cliente,
        deliveryAddress: dbOrder.direccion_entrega,
        district: dbOrder.distrito,
        reference: dbOrder.referencia,
        paymentMethod: dbOrder.metodo_pago,
        notes: dbOrder.notas_entrega,
        restaurante_nombre: dbOrder.tb_restaurantes?.restaurante_nombre,
        restaurant: dbOrder.tb_restaurantes?.restaurante_nombre
      }));
      console.log(`✅ ${orders.length} pedidos obtenidos de la base de datos`);
      if (orders.length > 0) {
        console.log('📊 Primer pedido mapeado:', orders[0]);
      }
      console.log('📊 Todos los pedidos:', JSON.stringify(orders, null, 2));
    } else {
      console.warn('⚠️ result.orders no existe, está vacío o no es un array');
      console.log('📊 Estructura de result:', Object.keys(result));
    }
  } catch (error) {
    console.error('❌ ERROR CRÍTICO obteniendo pedidos de BD:', error);
    console.error('💥 Stack:', error.stack);
    
    // ✅ FALLBACK A LOCALSTORAGE
    console.warn('⚠️ Usando localStorage como fallback...');
    orders = window.Session && window.Session.getOrders ? 
      window.Session.getOrders(user.email) : [];
  }

  const activosContainer = document.getElementById('pedidosActivosList');
  const historialContainer = document.getElementById('historialPedidosList');
  
  if (!activosContainer || !historialContainer) {
    console.error('❌ Contenedores no encontrados en el DOM');
    return;
  }
  
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
  
  computeStats(currentUserOrders);  // ← Actualizar estadísticas después de cargar
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
      <p class="mb-1"><strong>🍽️ Restaurante:</strong> ${order.restaurante_nombre || order.restaurant || 'N/A'}</p>
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
// ==============================
// 🔹 UTILIDAD: OBTENER COLOR BADGE SEGÚN ESTADO
// ==============================
function getStatusBadgeClass(estado) {
  const estadoLower = String(estado).toLowerCase().trim();
  
  const colorMap = {
    'recibido': 'bg-info text-white',        // Azul - orden recibida
    'aceptado': 'bg-success text-white',     // Verde - restaurante aceptó
    'preparando': 'bg-warning text-dark',    // Naranja - en preparación
    'listo': 'bg-danger text-white',         // Rojo - listo para recoger
    'en_camino': 'bg-purple text-white',     // Púrpura - repartidor en camino
    'encamino': 'bg-purple text-white',      // Alternativa sin guion
    'llegado': 'bg-secondary text-white',    // Gris/Marrón - llegó destino
    'entregado': 'bg-dark text-white',       // Oscuro - completado
    'cancelado': 'bg-danger text-white',     // Rojo - cancelado
    'rechazado': 'bg-danger text-white'      // Rojo - rechazado
  };
  
  return colorMap[estadoLower] || 'bg-secondary text-white';
}

// ==============================
// 🔹 OBTENER DESCRIPCIÓN DE ESTADO
// ==============================
function getStatusDescription(estado) {
  const estadoLower = String(estado).toLowerCase().trim();
  
  const descriptions = {
    'recibido': 'Pedido recibido',
    'aceptado': 'Aceptado por el restaurante',
    'preparando': 'En preparación',
    'listo': 'Listo para recoger',
    'en_camino': 'En camino',
    'encamino': 'En camino',
    'llegado': 'Llegado al destino',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado',
    'rechazado': 'Rechazado'
  };
  
  return descriptions[estadoLower] || estado;
}

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
  let steps = [];
  
  // ✅ SI HAY TRACKING DEL BACKEND, USAR ESE
  if (order.tb_pedido_rastreo && Array.isArray(order.tb_pedido_rastreo) && order.tb_pedido_rastreo.length > 0) {
    console.log('📊 Usando rastreo del backend:', order.tb_pedido_rastreo);
    steps = order.tb_pedido_rastreo.map(rastreo => ({
      step: rastreo.estado_nuevo,
      description: `Cambio hecho por: ${rastreo.cambio_por}`,
      observaciones: rastreo.observaciones,
      time: rastreo.fecha_cambio
    }));
  } else {
    // FALLBACK a pasos por defecto
    steps = getDefaultTrackingSteps(order);
  }
  
  if (String(order.status).toLowerCase() === 'entregado') {
    html += `<div class="alert alert-success text-center fw-bold mb-4">✅ Tu pedido fue entregado correctamente.</div>`;
  } else if (String(order.status).toLowerCase() === 'llegado') {
    html += `<div class="alert alert-info text-center fw-bold mb-4">🚚 Tu pedido ha llegado al destino. Confirma cuando lo recibas.</div>`;
  }
  
  html += '<h6 class="fw-bold mb-3">📋 Seguimiento del Pedido</h6>';
  html += '<div class="timeline">';
  
  const currentStatus = String(order.status || '').toLowerCase();
  const statusOrder = ['recibido', 'aceptado', 'preparando', 'listo', 'camino', 'llegado', 'entregado'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  
  steps.forEach((step, index) => {
    const stepStatus = String(step.step || '').toLowerCase();
    const stepIndex = statusOrder.indexOf(stepStatus);
    const isCompleted = stepIndex <= currentIndex && stepIndex !== -1;
    const isCurrent = stepStatus === currentStatus;
    
    html += `
      <div class="d-flex align-items-start mb-3">
        <div class="me-3" style="width:40px; text-align:center;">
          <i class="bi ${isCompleted ? 'bi-check-circle-fill text-success' : (isCurrent ? 'bi-arrow-right-circle-fill text-warning' : 'bi-circle text-muted')} fs-5"></i>
        </div>
        <div class="flex-grow-1">
          <div class="${isCompleted ? 'fw-bold text-success' : (isCurrent ? 'fw-bold text-warning' : 'text-muted')}">
            ${step.step}
            ${isCurrent ? ' <span class="badge bg-warning text-dark">Actual</span>' : ''}
          </div>
          <small class="text-muted d-block">${step.description || ''}</small>
          ${step.observaciones ? `<small class="text-info d-block">📝 <strong>Nota del repartidor:</strong> ${step.observaciones}</small>` : ''}
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
  const orderStatus = String(order.status || 'recibido').toLowerCase();
  
  const steps = [
    { step: 'recibido', description: 'Hemos recibido tu pedido', time: order.date },
    { step: 'aceptado', description: 'Aceptado por el restaurante' },
    { step: 'preparando', description: 'En preparación' },
    { step: 'listo', description: 'Listo para envío' },
    { step: 'camino', description: 'En camino' },
    { step: 'llegado', description: 'Pedido llegado al destino' },
    { step: 'entregado', description: 'Entregado' }
  ];
  
  return steps;
}

// ==============================
// 🔹 RENDERIZAR ITEM DE PEDIDO - VERSIÓN MEJORADA
// ==============================
function renderOrderItem(order, activosContainer, historialContainer, ACTIVE_STATES) {
  console.log('📦 Renderizando orden:', order);
  
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

// ==============================
// 🔹 FILTRAR HISTORIAL POR ESTADO
// ==============================
function filtrarHistorial(status) {
  console.log('🔍 Filtrando historial por estado:', status);
  
  const historialContainer = document.getElementById('historialPedidosList');
  if (!historialContainer) {
    console.error('❌ historialPedidosList no encontrado');
    return;
  }

  // Actualizar botones activos
  const buttons = document.querySelectorAll('.filtro-historial-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Marcar botón activo
  event.target?.classList?.add('active');

  // Filtrar pedidos
  let filteredOrders = currentUserOrders;
  
  if (status !== 'all') {
    const statusMap = {
      'delivered': ['entregado'],
      'cancelled': ['cancelado', 'rechazado'],
      'all': [] // Mostrar todos
    };
    
    const targetStates = statusMap[status] || [];
    
    filteredOrders = currentUserOrders.filter(order => 
      targetStates.includes(String(order.status || '').toLowerCase())
    );
  }

  // Renderizar pedidos filtrados
  historialContainer.innerHTML = '';
  
  if (filteredOrders.length === 0) {
    historialContainer.innerHTML = '<div class="text-muted text-center py-3">No hay pedidos en esta categoría</div>';
    return;
  }

  const ACTIVE_STATES = ['recibido', 'preparando', 'camino', 'listo', 'llegado'];
  
  filteredOrders.forEach(order => {
    renderOrderItem(order, null, historialContainer, ACTIVE_STATES);
  });
  
  console.log('✅ Mostrados', filteredOrders.length, 'pedidos');
}