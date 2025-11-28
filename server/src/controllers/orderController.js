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
      paymentMethod
    } = req.body;

    const userId = req.user.id;

    console.log('📦 Creando pedido para usuario:', userId);

    // 1. Crear el pedido principal - SOLO COLUMNAS QUE EXISTEN
    const { data: order, error: orderError } = await supabase
      .from('pedidos')
      .insert([{
        cliente_id: userId,
        total: total,
        estado: 'recibido'  // ← 'recibido' está en tu CHECK constraint
        // 'creado_en' se genera automáticamente con DEFAULT NOW()
        // restaurante_id y repartidor_id pueden ser NULL
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

// ✅ ACTUALIZAR ESTADO DEL PEDIDO
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const { data: order, error } = await supabase
      .from('pedidos')
      .update({ estado: status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Error actualizando estado del pedido'
      });
    }

    res.json({
      success: true,
      message: 'Estado actualizado correctamente',
      order
    });

  } catch (error) {
    console.error('💥 Error en updateOrderStatus:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};