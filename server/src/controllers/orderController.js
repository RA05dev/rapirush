import { supabase } from '../config/supabaseClient.js';

// ✅ CREAR NUEVO PEDIDO
export const createOrder = async (req, res) => {
  try {
    const { 
      items, 
      subtotal, 
      delivery, 
      discount, 
      total, 
      address, 
      phone,
      customerName,
      paymentMethod,
      notes,        
      reference     
    } = req.body;

    const userId = req.user.id;

    console.log('📦 Creando pedido para usuario:', userId);

    // Obtener restaurante_id del primer item del carrito
    let restauranteId = null;
    if (items && items.length > 0 && items[0].restaurante_id) {
      restauranteId = items[0].restaurante_id;
    }

    // 1. Crear el pedido principal con TODOS los datos requeridos
    const { data: order, error: orderError } = await supabase
      .from('pedidos')
      .insert([{
        cliente_id: userId,
        restaurante_id: restauranteId,
        subtotal: subtotal,
        total: total,
        delivery_fee: delivery || 0,
        descuento: discount || 0,
        direccion_entrega: address,
        distrito_entrega: address.split(',')[1]?.trim() || 'Lima',
        telefono_contacto: phone,
        metodo_pago: paymentMethod,
        nota_repartidor: notes || '',           // ← Guardar notas del cliente
        referencia_entrega: reference || '',    // ← Guardar referencia
        estado: 'recibido'
        // 'creado_en' se genera automáticamente con DEFAULT NOW()
      }])
      .select()
      .single();

    if (orderError) {
      console.error('❌ Error creando pedido:', orderError);
      return res.status(400).json({
        success: false,
        error: 'Error creando pedido: ' + orderError.message
      });
    }

    // 2. Crear items del pedido - USANDO NOMBRES CORRECTOS
    const orderItems = items.map(item => ({
      pedido_id: order.id,
      nombre_item: item.name + (item.notes ? ` - ${item.notes}` : ''), // ← Incluir notas si existen
      cantidad: item.quantity,
      precio: item.price
    }));

    const { error: itemsError } = await supabase
      .from('pedido_detalle')
      .insert(orderItems);

    if (itemsError) {
      console.error('❌ Error creando items del pedido:', itemsError);
      // Eliminar el pedido principal si fallan los items
      await supabase.from('pedidos').delete().eq('id', order.id);
      return res.status(400).json({
        success: false,
        error: 'Error agregando items al pedido'
      });
    }

    // ✅ 3. CREAR REGISTRO INICIAL DE RASTREO
    const trackingData = {
      pedido_id: order.id,
      estado: 'recibido',
      fecha: new Date().toISOString()
    };
    
    // ✅ Intenta agregar descripcion si la tabla lo soporta
    try {
      const { error: trackingError } = await supabase
        .from('pedido_rastreo')
        .insert([{
          ...trackingData,
          mensaje: 'Pedido creado y esperando confirmación del restaurante'
        }]);

      if (trackingError) {
        // Si falla por descripcion, intenta sin ella
        if (trackingError.message?.includes('descripcion')) {
          console.log('ℹ️ Tabla pedido_rastreo no tiene columna descripcion, intentando sin ella...');
          const { error: simpleTrackingError } = await supabase
            .from('pedido_rastreo')
            .insert([trackingData]);
          
          if (simpleTrackingError) {
            console.error('⚠️ Error creando rastreo (no es crítico):', simpleTrackingError);
          } else {
            console.log('✅ Rastreo inicial creado para pedido:', order.id);
          }
        } else {
          console.error('⚠️ Error creando rastreo (no es crítico):', trackingError);
        }
      } else {
        console.log('✅ Rastreo inicial creado para pedido:', order.id);
      }
    } catch (trackingException) {
      console.error('⚠️ Error en lógica de rastreo:', trackingException);
      // No es crítico, continuar
    }

    console.log('✅ Pedido creado exitosamente:', order.id);

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      order: {
        id: order.id,
        numero: `#${order.id.toString().slice(-6)}`,
        total: order.total,
        estado: order.estado,
        fecha: order.creado_en
      }
    });

  } catch (error) {
    console.error('💥 Error inesperado en createOrder:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// ✅ OBTENER PEDIDOS DEL USUARIO
export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('📋 Obteniendo pedidos para usuario:', userId);

    const { data: orders, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        pedido_detalle (*)
      `)
      .eq('cliente_id', userId)
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo pedidos:', error);
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo pedidos'
      });
    }

    console.log(`✅ Encontrados ${orders?.length || 0} pedidos`);

    res.json({
      success: true,
      orders: orders || []
    });

  } catch (error) {
    console.error('💥 Error inesperado en getOrdersByUser:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// ✅ OBTENER PEDIDO ESPECÍFICO
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const { data: order, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        pedido_detalle (*)
      `)
      .eq('id', orderId)
      .eq('cliente_id', userId)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('💥 Error en getOrderById:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// ✅ OBTENER PEDIDOS DEL RESTAURANTE
export const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user.id;

    console.log('📋 Obteniendo pedidos para restaurante:', restaurantId);
    console.log('👤 Usuario autenticado:', userId);

    // ✅ VERIFICAR QUE EL USUARIO ES PROPIETARIO DEL RESTAURANTE
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurantes')
      .select('usuario_id')
      .eq('id', restaurantId)
      .single();

    if (restaurantError || !restaurant) {
      console.error('❌ Restaurante no encontrado:', restaurantId);
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }

    if (restaurant.usuario_id !== userId) {
      console.error('❌ No autorizado: usuario no es propietario del restaurante');
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para ver estos pedidos'
      });
    }

    // ✅ OBTENER PEDIDOS DEL RESTAURANTE
    const { data: orders, error } = await supabase
      .from('pedidos')
      .select(`
        id,
        cliente_id,
        restaurante_id,
        total,
        estado,
        creado_en,
        direccion_entrega,
        distrito_entrega,
        nota_repartidor,
        referencia_entrega,
        pedido_detalle (
          id,
          nombre_item,
          cantidad,
          precio
        ),
        clientes (
          nombres,
          telefono
        )
      `)
      .eq('restaurante_id', restaurantId)
      .in('estado', ['recibido', 'aceptado', 'preparando', 'listo'])
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo pedidos:', error);
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo pedidos'
      });
    }

    // ✅ MAPEAR DATOS PARA FRONTEND
    const mappedOrders = orders.map(order => ({
      id: order.id,
      cliente_id: order.cliente_id,
      restaurante_id: order.restaurante_id,
      total: order.total,
      status: order.estado,
      creado_en: order.creado_en,
      delivery_address: order.direccion_entrega,
      district: order.distrito_entrega,
      nota_repartidor: order.nota_repartidor,
      referencia_entrega: order.referencia_entrega,
      cliente_nombres: order.clientes?.nombres || 'N/A',
      cliente_telefono: order.clientes?.telefono || 'N/A',
      items: order.pedido_detalle || [],
      item_count: order.pedido_detalle?.length || 0
    }));

    console.log(`✅ Encontrados ${mappedOrders.length} pedidos`);

    res.json({
      success: true,
      orders: mappedOrders
    });

  } catch (error) {
    console.error('💥 Error inesperado en getOrdersByRestaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// ✅ OBTENER PEDIDOS DEL REPARTIDOR
export const getOrdersByRepartidor = async (req, res) => {
  try {
    const { repartidorId } = req.params;
    const userId = req.user.id;

    console.log('📋 Obteniendo pedidos para repartidor:', repartidorId);

    // ✅ OBTENER PEDIDOS DEL REPARTIDOR - Primero intentar con repartidor_id
    let { data: orders, error } = await supabase
      .from('pedidos')
      .select(`
        id,
        cliente_id,
        restaurante_id,
        total,
        estado,
        creado_en,
        direccion_entrega,
        distrito_entrega,
        nota_repartidor,
        referencia_entrega,
        pedido_detalle (
          id,
          nombre_item,
          cantidad,
          precio
        ),
        clientes (
          nombres,
          telefono
        )
      `)
      .in('estado', ['listo', 'camino', 'llegado', 'entregado'])
      .order('creado_en', { ascending: false });

    // ✅ Si hay error por columna no existente, intentar query alternativa
    if (error && error.message.includes('repartidor_id')) {
      console.warn('⚠️ Columna repartidor_id no existe, intentando query alternativa...');
      
      // Fallback: Obtener todos los pedidos en estado "listo" (disponibles)
      const { data: availableOrders, error: altError } = await supabase
        .from('pedidos')
        .select(`
          id,
          cliente_id,
          restaurante_id,
          total,
          estado,
          creado_en,
          direccion_entrega,
          distrito_entrega,
          nota_repartidor,
          referencia_entrega,
          pedido_detalle (
            id,
            nombre_item,
            cantidad,
            precio
          ),
          clientes (
            nombres,
            telefono
          )
        `)
        .in('estado', ['listo', 'camino', 'llegado', 'entregado'])
        .order('creado_en', { ascending: false });

      if (altError) {
        console.error('❌ Error en query alternativa:', altError);
        return res.status(500).json({
          success: false,
          error: 'Error obteniendo pedidos',
          details: altError.message
        });
      }

      orders = availableOrders;
      error = null;
    }

    if (error) {
      console.error('❌ Error obteniendo pedidos:', error);
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo pedidos',
        details: error.message
      });
    }

    // ✅ MAPEAR DATOS PARA FRONTEND 
    const mappedOrders = (orders || []).map(order => ({
      id: order.id,
      cliente_id: order.cliente_id,
      restaurante_id: order.restaurante_id,
      total: order.total,
      status: order.estado,
      estado: order.estado,
      creado_en: order.creado_en,
      delivery_address: order.direccion_entrega,
      direccion_entrega: order.direccion_entrega,
      district: order.distrito_entrega,
      distrito_entrega: order.distrito_entrega,
      nota_repartidor: order.nota_repartidor,
      referencia_entrega: order.referencia_entrega,
      cliente_nombres: order.clientes?.nombres || 'N/A',
      cliente_telefono: order.clientes?.telefono || 'N/A',
      items: order.pedido_detalle || [],
      item_count: order.pedido_detalle?.length || 0
    }));

    console.log(`✅ Encontrados ${mappedOrders.length} pedidos para repartidor ${repartidorId}`);

    res.json({
      success: true,
      orders: mappedOrders
    });

  } catch (error) {
    console.error('💥 Error inesperado en getOrdersByRepartidor:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

// ✅ NORMALIZAR ESTADO (mapea estados del frontend a estándares)
const normalizeOrderState = (inputState) => {
  const stateMap = {
    // Estados estándar ya normalizados
    'pedido_recibido': 'pedido_recibido',
    'preparacion': 'preparacion',
    'listo': 'listo',
    'en_camino': 'en_camino',
    'llegado': 'llegado',
    'entregado': 'entregado',
    'cancelado': 'cancelado',
    
    // Alias del frontend (restaurante)
    'recibido': 'pedido_recibido',
    'aceptado': 'preparacion',
    'preparando': 'preparacion',
    'rechazado': 'cancelado',
    
    // Alias del frontend (repartidor)
    'en camino': 'en_camino',
  };
  
  return stateMap[inputState] || inputState;
};

// ✅ ACTUALIZAR ESTADO DE PEDIDO
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    let { estado } = req.body;
    const userId = req.user.id;

    // Normalizar estado
    const normalizedEstado = normalizeOrderState(estado);
    
    console.log(`📝 Actualizando pedido ${orderId} de "${estado}" → "${normalizedEstado}"`);

    // Estados permitidos
    const allowedStates = ['pedido_recibido', 'preparacion', 'en_camino', 'llegado', 'entregado', 'cancelado'];
    if (!allowedStates.includes(normalizedEstado)) {
      return res.status(400).json({
        success: false,
        error: `Estado no válido. Entrada: "${estado}", Normalizado: "${normalizedEstado}"`
      });
    }

    // 1. Obtener el pedido
    const { data: order, error: orderError } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }

    // 2. Actualizar estado del pedido con estado normalizado
    const { error: updateError } = await supabase
      .from('pedidos')
      .update({ estado: normalizedEstado })
      .eq('id', orderId);

    if (updateError) {
      console.error('❌ Error actualizando pedido:', updateError);
      return res.status(400).json({
        success: false,
        error: 'Error al actualizar pedido'
      });
    }

    // 3. Agregar registro de rastreo
    const trackingData = {
      pedido_id: orderId,
      estado: normalizedEstado,
      fecha: new Date().toISOString()
    };

const { error: trackingError } = await supabase
  .from('pedido_rastreo')
  .insert([trackingData]);

if (trackingError) {
  console.warn('⚠️ No se pudo guardar rastreo:', trackingError);
}
    console.log(`✅ Pedido ${orderId} actualizado a: ${normalizedEstado}`);

    res.json({
      success: true,
      message: `Pedido actualizado a: ${normalizedEstado}`,
      order: {
        id: orderId,
        estado: normalizedEstado
      }
    });

  } catch (error) {
    console.error('💥 Error en updateOrderStatus:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};