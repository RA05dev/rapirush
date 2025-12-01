import { supabase } from '../config/supabaseClient.js';

/**
 * ✅ CREAR TRACKING RECORD
 * Registra cambios de estado en tb_pedido_rastreo
 */
async function createTrackingRecord(pedidoId, estadoAnterior, estadoNuevo, cambiadoPor) {
  try {
    const { error } = await supabase
      .from('tb_pedido_rastreo')
      .insert([{
        pedido_id: pedidoId,
        estado_anterior: estadoAnterior,
        estado_nuevo: estadoNuevo,
        cambio_por: cambiadoPor,  // 'restaurante', 'repartidor', 'sistema', 'admin'
        observaciones: '',
        fecha_cambio: new Date().toISOString()
      }]);

    if (error) {
      console.error('⚠️ Error creando rastreo:', error);
      return false;
    }
    
    console.log(`✅ Rastreo registrado: ${estadoAnterior} → ${estadoNuevo}`);
    return true;

  } catch (error) {
    console.error('⚠️ Error en createTrackingRecord:', error);
    return false;
  }
}

// ✅ CREAR NUEVO PEDIDO (Nueva BD)
export const createOrder = async (req, res) => {
  try {
    const { 
      items, 
      subtotal, 
      delivery, 
      total, 
      address, 
      phone,
      customerName,
      paymentMethod,
      notes,        
      reference,
      distrito
    } = req.body;

    const userId = req.user.usuario_id;

    console.log('📦 Creando pedido para usuario:', userId);

    // ✅ 1. Obtener cliente_id desde tb_clientes
    const { data: clientData, error: clientError } = await supabase
      .from('tb_clientes')
      .select('cliente_id')
      .eq('usuario_id', userId)
      .single();

    if (clientError || !clientData) {
      console.error('❌ Cliente no encontrado:', clientError);
      return res.status(400).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }

    // ✅ 2. Obtener restaurante_id y validar que todos los items sean del mismo restaurante
    let restauranteId = null;
    if (items && items.length > 0) {
      restauranteId = items[0].restaurante_id;
      
      // Verificar que todos los items sean del mismo restaurante
      const allSameRestaurant = items.every(item => item.restaurante_id === restauranteId);
      if (!allSameRestaurant) {
        console.error('❌ Error: Items de múltiples restaurantes en una orden');
        return res.status(400).json({
          success: false,
          error: 'No puedes ordenar de múltiples restaurantes en una sola orden'
        });
      }
      
      console.log(`✅ Validado: Todos los items son del restaurante ${restauranteId}`);
    }

    if (!restauranteId) {
      return res.status(400).json({
        success: false,
        error: 'No se especificó restaurante'
      });
    }

    // ✅ 3. Generar número de pedido único
    const numeroPedido = `PED-${Date.now()}`;

    // ✅ Mapear método de pago del frontend al valor de BD
    const paymentMethodMap = {
        'cash': 'efectivo',
        'card': 'tarjeta',
        'digital': 'digital',
        'efectivo': 'efectivo',
        'tarjeta': 'tarjeta'
    };
    const mappedPaymentMethod = paymentMethodMap[paymentMethod] || 'efectivo';

    // ✅ 4. Crear el pedido en tb_pedidos (con TODOS los campos del checkout)
    const { data: order, error: orderError } = await supabase
      .from('tb_pedidos')
      .insert([{
        cliente_id: clientData.cliente_id,
        restaurante_id: restauranteId,
        numero_pedido: numeroPedido,
        estado: 'recibido',
        nombre_cliente: customerName,
        telefono_cliente: phone,
        direccion_entrega: address,
        distrito: distrito || 'Lima',
        referencia: reference || '',
        notas_adicionales: notes || '',
        subtotal: parseFloat(subtotal) || 0,
        costo_envio: parseFloat(delivery) || 0,
        total: parseFloat(total),
        metodo_pago: mappedPaymentMethod,
        fecha_creacion: new Date().toISOString()
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

    console.log('✅ Pedido creado:', order.pedido_id);

    // ✅ 5. Crear items del pedido en tb_pedido_detalles
    const orderItems = items.map(item => {
      console.log('📝 Mapeando item:', {
        name: item.name,
        producto_id: item.producto_id,
        quantity: item.quantity,
        size: item.size,
        talla: item.talla
      });
      return {
        pedido_id: order.pedido_id,
        producto_id: item.producto_id,
        nombre_producto: item.name + (item.size ? ` (${item.size})` : ''),
        cantidad: item.quantity,
        precio_unitario: parseFloat(item.price),
        subtotal: parseFloat(item.price) * item.quantity,
        tamaño_id: item.tamaño_id || item.size_id || null,
        notas_adicionales: item.notas_adicionales || item.notes || ''
      };
    });

    const { error: itemsError } = await supabase
      .from('tb_pedido_detalles')
      .insert(orderItems);

    if (itemsError) {
      console.error('❌ Error creando items:', itemsError);
      // Eliminar el pedido si fallan los items
      await supabase.from('tb_pedidos').delete().eq('pedido_id', order.pedido_id);
      return res.status(400).json({
        success: false,
        error: 'Error agregando items al pedido'
      });
    }

    console.log(`✅ Items creados: ${orderItems.length}`);

    // ✅ 6. Crear registro inicial de rastreo
    await createTrackingRecord(order.pedido_id, null, 'recibido', 'sistema');

    console.log('✅ Pedido creado exitosamente:', order.pedido_id);

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      order: {
        pedido_id: order.pedido_id,
        numero_pedido: numeroPedido,
        total: order.total,
        estado: order.estado,
        fecha_creacion: order.fecha_creacion
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
    const userId = req.user.usuario_id;

    console.log('📋 Obteniendo pedidos para usuario:', userId);

    // Obtener cliente_id
    const { data: clientData } = await supabase
      .from('tb_clientes')
      .select('cliente_id')
      .eq('usuario_id', userId)
      .single();

    if (!clientData) {
      return res.json({
        success: true,
        orders: []
      });
    }

    const { data: orders, error } = await supabase
      .from('tb_pedidos')
      .select(`
        *,
        tb_pedido_detalles(*),
        tb_restaurantes(
          restaurante_nombre,
          restaurante_telefono
        )
      `)
      .eq('cliente_id', clientData.cliente_id)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo pedidos:', error);
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo pedidos'
      });
    }

    console.log(`✅ Encontrados ${orders?.length || 0} pedidos para cliente ${clientData.cliente_id}`);

    if (orders && orders.length > 0) {
      console.log('📊 Estructura del primer pedido:', JSON.stringify(orders[0], null, 2));
    } else {
      // DEBUG: Si no hay pedidos, obtener TODOS para ver si hay datos en la BD
      console.log('⚠️ Sin pedidos para este cliente, obteniendo todos los pedidos para debug...');
      const { data: allOrders } = await supabase
        .from('tb_pedidos')
        .select('cliente_id, numero_pedido, estado, fecha_creacion')
        .limit(5)
        .order('fecha_creacion', { ascending: false });
      console.log('📊 Últimos 5 pedidos en BD:', JSON.stringify(allOrders, null, 2));
    }

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
    const userId = req.user.usuario_id;
    const userRol = req.user.rol;

    console.log('📋 Obteniendo pedido:', { orderId, userId, userRol });

    const { data: order, error } = await supabase
      .from('tb_pedidos')
      .select(`
        *,
        tb_pedido_detalles(*),
        tb_restaurantes(
          restaurante_nombre,
          restaurante_telefono,
          restaurante_direccion,
          usuario_id
        ),
        tb_clientes(
          usuario_id
        ),
        tb_pedido_rastreo(
          estado_nuevo,
          cambio_por,
          fecha_cambio
        )
      `)
      .eq('pedido_id', orderId)
      .single();

    if (error || !order) {
      console.error('❌ Pedido no encontrado:', orderId);
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }

    // ✅ Verificar permisos según rol
    if (userRol === 'cliente') {
      // Cliente solo puede ver sus propios pedidos
      if (order.tb_clientes[0]?.usuario_id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permiso para ver este pedido'
        });
      }
    } else if (userRol === 'restaurante') {
      // Restaurante solo puede ver pedidos de su restaurante
      if (order.tb_restaurantes[0]?.usuario_id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permiso para ver este pedido'
        });
      }
    } else if (userRol === 'repartidor') {
      // Repartidor solo puede ver pedidos asignados a él
      if (order.repartidor_id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permiso para ver este pedido'
        });
      }
    }

    console.log('✅ Pedido encontrado:', orderId);

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
    const userId = req.user.usuario_id;

    console.log('📋 Obteniendo pedidos para restaurante del usuario:', userId);

    // ✅ Obtener restaurante_id del usuario
    const { data: restaurant, error: restaurantError } = await supabase
      .from('tb_restaurantes')
      .select('restaurante_id')
      .eq('usuario_id', userId)
      .single();

    if (restaurantError || !restaurant) {
      console.error('❌ Restaurante no encontrado para usuario:', userId);
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }

    const restaurantId = restaurant.restaurante_id;

    // ✅ Obtener pedidos del restaurante
    const { data: orders, error } = await supabase
      .from('tb_pedidos')
      .select(`
        *,
        tb_pedido_detalles(*),
        tb_clientes(
          cliente_nombre,
          cliente_apellido,
          cliente_telefono
        )
      `)
      .eq('restaurante_id', restaurantId)
      .in('estado', ['recibido', 'aceptado', 'preparando', 'listo', 'camino', 'llegado'])
      .order('fecha_creacion', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo pedidos:', error);
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo pedidos'
      });
    }

    console.log(`✅ Encontrados ${orders?.length || 0} pedidos para restaurante ${restaurantId}`);

    res.json({
      success: true,
      orders: orders || []
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
    const userId = req.user.usuario_id;

    console.log('📋 Obteniendo pedidos para repartidor:', userId);

    // ✅ Obtener repartidor_id del usuario
    const { data: repartidor, error: repartidorError } = await supabase
      .from('tb_repartidores')
      .select('repartidor_id')
      .eq('usuario_id', userId)
      .single();

    if (repartidorError || !repartidor) {
      console.error('❌ Repartidor no encontrado para usuario:', userId);
      return res.status(404).json({
        success: false,
        error: 'Repartidor no encontrado'
      });
    }

    const repartidorId = repartidor.repartidor_id;

    // ✅ Query 1: Obtener pedidos disponibles (sin asignar, estado 'listo')
    const { data: availableOrders, error: availableError } = await supabase
      .from('tb_pedidos')
      .select(`
        pedido_id,
        estado,
        total,
        fecha_creacion,
        repartidor_id,
        restaurante_id,
        cliente_id,
        direccion_entrega,
        tb_pedido_detalles(*),
        tb_restaurantes(
          restaurante_nombre,
          restaurante_direccion
        ),
        tb_clientes(
          cliente_nombre,
          cliente_apellido,
          cliente_telefono
        )
      `)
      .is('repartidor_id', null)
      .eq('estado', 'listo')
      .order('fecha_creacion', { ascending: false });

    if (availableError) {
      console.error('❌ Error obteniendo pedidos disponibles:', availableError);
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo pedidos disponibles'
      });
    }

    // ✅ Query 2: Obtener pedidos asignados a este repartidor (en estados de entrega)
    const { data: assignedOrders, error: assignedError } = await supabase
      .from('tb_pedidos')
      .select(`
        pedido_id,
        estado,
        total,
        fecha_creacion,
        repartidor_id,
        restaurante_id,
        cliente_id,
        direccion_entrega,
        tb_pedido_detalles(*),
        tb_restaurantes(
          restaurante_nombre,
          restaurante_direccion
        ),
        tb_clientes(
          cliente_nombre,
          cliente_apellido,
          cliente_telefono
        )
      `)
      .eq('repartidor_id', repartidorId)
      .in('estado', ['camino', 'llegado', 'entregado'])
      .order('fecha_creacion', { ascending: false });

    if (assignedError) {
      console.error('❌ Error obteniendo pedidos asignados:', assignedError);
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo pedidos asignados'
      });
    }

    // ✅ Combinar ambos arrays
    const allOrders = [...(availableOrders || []), ...(assignedOrders || [])];

    console.log(`✅ Encontrados ${availableOrders?.length || 0} disponibles + ${assignedOrders?.length || 0} asignados = ${allOrders.length} total para repartidor ${repartidorId}`);

    res.json({
      success: true,
      data: allOrders
    });

  } catch (error) {
    console.error('💥 Error inesperado en getOrdersByRepartidor:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// ✅ ACTUALIZAR ESTADO DE PEDIDO (RESTAURANTE)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { nuevoEstado } = req.body;
    const userId = req.user.usuario_id;
    const userRol = req.user.rol;

    console.log(`📝 Actualizando pedido ${orderId} a: ${nuevoEstado} por ${userRol}`);

    // Estados permitidos
    const allowedStates = ['recibido', 'aceptado', 'preparando', 'listo', 'camino', 'llegado', 'entregado', 'cancelado'];
    if (!allowedStates.includes(nuevoEstado)) {
      return res.status(400).json({
        success: false,
        error: `Estado no válido: ${nuevoEstado}`
      });
    }

    // ✅ 1. Obtener pedido y verificar permisos
    const { data: order, error: fetchError } = await supabase
      .from('tb_pedidos')
      .select(`
        *,
        tb_restaurantes(
          usuario_id
        )
      `)
      .eq('pedido_id', orderId)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }

    // ✅ Verificar permisos según rol
    if (userRol === 'restaurante') {
      // Verificar que el restaurante es dueño del pedido
      if (order.tb_restaurantes[0]?.usuario_id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permiso para modificar este pedido'
        });
      }
    } else if (userRol === 'repartidor') {
      // Verificar que el repartidor está asignado al pedido
      if (order.repartidor_id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permiso para modificar este pedido'
        });
      }
    }

    const estadoAnterior = order.estado;

    // ✅ 2. Actualizar estado en tb_pedidos
    const updateData = { 
      estado: nuevoEstado
    };

    // Si el pedido se entrega, registrar fecha_entrega
    if (nuevoEstado === 'entregado') {
      updateData.fecha_entrega = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('tb_pedidos')
      .update(updateData)
      .eq('pedido_id', orderId);

    if (updateError) {
      console.error('❌ Error actualizando pedido:', updateError);
      return res.status(400).json({
        success: false,
        error: 'Error actualizando estado'
      });
    }

    // ✅ 3. Crear registro en tb_pedido_rastreo
    await createTrackingRecord(orderId, estadoAnterior, nuevoEstado, userRol);

    console.log(`✅ Pedido ${orderId} actualizado a: ${nuevoEstado}`);

    res.json({
      success: true,
      message: `Pedido actualizado a: ${nuevoEstado}`,
      order: {
        pedido_id: orderId,
        estado: nuevoEstado
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

// ✅ ASIGNAR REPARTIDOR A PEDIDO
export const assignRepartidor = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.usuario_id;

    console.log(`🚴 Asignando repartidor ${userId} al pedido ${orderId}`);

    // ✅ 1. Verificar que el usuario es repartidor
    const { data: repartidor, error: repError } = await supabase
      .from('tb_repartidores')
      .select('repartidor_id, es_disponible')
      .eq('usuario_id', userId)
      .single();

    if (repError || !repartidor) {
      return res.status(403).json({
        success: false,
        error: 'No eres un repartidor válido'
      });
    }

    if (!repartidor.es_disponible) {
      return res.status(400).json({
        success: false,
        error: 'Debes estar disponible para aceptar pedidos'
      });
    }

    // ✅ 2. Verificar que el pedido está listo para entrega
    const { data: order, error: orderError } = await supabase
      .from('tb_pedidos')
      .select('estado, repartidor_id')
      .eq('pedido_id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }

    if (order.estado !== 'listo') {
      return res.status(400).json({
        success: false,
        error: 'El pedido no está listo para entrega'
      });
    }

    if (order.repartidor_id) {
      return res.status(400).json({
        success: false,
        error: 'El pedido ya tiene un repartidor asignado'
      });
    }

    // ✅ 3. Asignar repartidor al pedido
    const { error: updateError } = await supabase
      .from('tb_pedidos')
      .update({
        repartidor_id: repartidor.repartidor_id,
        estado: 'camino'
      })
      .eq('pedido_id', orderId);

    if (updateError) {
      console.error('❌ Error asignando repartidor:', updateError);
      return res.status(400).json({
        success: false,
        error: 'Error asignando repartidor'
      });
    }

    // ✅ 4. Crear registro de rastreo
    await createTrackingRecord(orderId, 'listo', 'camino', 'repartidor');

    console.log(`✅ Repartidor ${repartidor.repartidor_id} asignado al pedido ${orderId}`);

    res.json({
      success: true,
      message: 'Pedido asignado exitosamente',
      order: {
        pedido_id: orderId,
        estado: 'camino',
        repartidor_id: repartidor.repartidor_id
      }
    });

  } catch (error) {
    console.error('💥 Error en assignRepartidor:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};