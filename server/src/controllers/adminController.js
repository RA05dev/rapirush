import { supabase } from '../config/supabaseClient.js';

export const adminController = {
  // ✅ OBTENER USUARIOS PENDIENTES (Restaurantes y Repartidores)
  async getPendingUsers(req, res) {
    try {
      const userId = req.user.usuario_id; // ← CAMBIAR de id a usuario_id

      // ✅ VERIFICAR que es admin
      const { data: adminUser, error: adminError } = await supabase
        .from('tb_usuarios')
        .select('rol, estado')
        .eq('usuario_id', userId) // ← CAMBIAR a usuario_id
        .single();

      if (adminError || adminUser?.rol !== 'admin') {
        console.error('❌ No es admin:', userId);
        return res.status(403).json({
          success: false,
          error: 'No autorizado'
        });
      }

      // ✅ OBTENER RESTAURANTES PENDIENTES
      const { data: pendingRestaurants, error: restError } = await supabase
        .from('tb_usuarios')
        .select(`
          usuario_id,
          email,
          rol,
          estado,
          fecha_creacion,
          tb_restaurantes (
            restaurante_id,
            restaurante_nombre,
            restaurante_telefono,
            restaurante_direccion,
            restaurante_descripcion,
            tipo_comida,
            tiempo_delivery,
            delivery_cost
          )
        `)
        .eq('rol', 'restaurante')
        .eq('estado', 'pendiente_aprobacion') // ← CAMBIAR a pendiente_aprobacion
        .order('fecha_creacion', { ascending: false });

      if (restError) {
        console.error('❌ Error obteniendo restaurantes:', restError);
      }

      // ✅ OBTENER REPARTIDORES PENDIENTES
      const { data: pendingDelivery, error: delError } = await supabase
        .from('tb_usuarios')
        .select(`
          usuario_id,
          email,
          rol,
          estado,
          fecha_creacion,
          tb_repartidores (
            repartidor_id,
            repartidor_nombre,
            repartidor_apellido,
            repartidor_telefono,
            tipo_vehiculo,
            placa
          )
        `)
        .eq('rol', 'repartidor')
        .eq('estado', 'pendiente_aprobacion') // ← CAMBIAR a pendiente_aprobacion
        .order('fecha_creacion', { ascending: false });

      if (delError) {
        console.error('❌ Error obteniendo repartidores:', delError);
      }

      // ✅ FORMATEAR RESPUESTA
      const formattedRestaurants = (pendingRestaurants || []).map(user => ({
        usuario_id: user.usuario_id,
        email: user.email,
        rol: user.rol,
        estado: user.estado,
        fecha_creacion: user.fecha_creacion,
        ...user.tb_restaurantes?.[0] || {}
      }));

      const formattedDelivery = (pendingDelivery || []).map(user => ({
        usuario_id: user.usuario_id,
        email: user.email,
        rol: user.rol,
        estado: user.estado,
        fecha_creacion: user.fecha_creacion,
        ...user.tb_repartidores?.[0] || {}
      }));

      res.json({
        success: true,
        pendingRestaurants: formattedRestaurants,
        pendingDelivery: formattedDelivery
      });

    } catch (error) {
      console.error('💥 Error en getPendingUsers:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // ✅ APROBAR USUARIO (Restaurante o Repartidor)
  async approveUser(req, res) {
    try {
      const userId = req.user.usuario_id; // ← CAMBIAR a usuario_id
      const { targetUserId, rol } = req.body;

      if (!targetUserId || !rol) {
        return res.status(400).json({
          success: false,
          error: 'Faltan datos requeridos: targetUserId y rol'
        });
      }

      // ✅ VERIFICAR que es admin
      const { data: adminUser, error: adminError } = await supabase
        .from('tb_usuarios')
        .select('rol')
        .eq('usuario_id', userId) // ← CAMBIAR a usuario_id
        .single();

      if (adminError || adminUser?.rol !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'No autorizado'
        });
      }

      if (!['restaurante', 'repartidor'].includes(rol)) {
        return res.status(400).json({
          success: false,
          error: 'Rol inválido'
        });
      }

      // ✅ CAMBIAR ESTADO A ACTIVO en tb_usuarios
      const { data: updatedUser, error: updateError } = await supabase
        .from('tb_usuarios')
        .update({ 
          estado: 'activo',
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('usuario_id', targetUserId) // ← CAMBIAR a usuario_id
        .eq('rol', rol)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error aprobando usuario:', updateError);
        return res.status(400).json({
          success: false,
          error: 'Error aprobando usuario: ' + updateError.message
        });
      }

      // ✅ SI ES RESTAURANTE, ACTIVARLO EN tb_restaurantes
      if (rol === 'restaurante') {
        const { error: restError } = await supabase
          .from('tb_restaurantes')
          .update({ 
            es_abierto: true,
            es_verificado: true,
            fecha_actualizacion: new Date().toISOString()
          })
          .eq('usuario_id', targetUserId);

        if (restError) {
          console.error('❌ Error activando restaurante:', restError);
        }
      }

      // ✅ SI ES REPARTIDOR, ACTIVARLO EN tb_repartidores
      if (rol === 'repartidor') {
        const { error: repError } = await supabase
          .from('tb_repartidores')
          .update({ 
            es_verificado: true,
            fecha_actualizacion: new Date().toISOString()
          })
          .eq('usuario_id', targetUserId);

        if (repError) {
          console.error('❌ Error activando repartidor:', repError);
        }
      }

      console.log(`✅ ${rol} aprobado por admin:`, targetUserId);

      res.json({
        success: true,
        message: `${rol} aprobado exitosamente`,
        user: updatedUser
      });

    } catch (error) {
      console.error('💥 Error en approveUser:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // ✅ RECHAZAR USUARIO
  async rejectUser(req, res) {
    try {
      const userId = req.user.usuario_id; // ← CAMBIAR a usuario_id
      const { targetUserId, rol, motivo } = req.body;

      if (!targetUserId || !rol) {
        return res.status(400).json({
          success: false,
          error: 'Faltan datos requeridos: targetUserId y rol'
        });
      }

      // ✅ VERIFICAR que es admin
      const { data: adminUser, error: adminError } = await supabase
        .from('tb_usuarios')
        .select('rol')
        .eq('usuario_id', userId) // ← CAMBIAR a usuario_id
        .single();

      if (adminError || adminUser?.rol !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'No autorizado'
        });
      }

      // ✅ CAMBIAR ESTADO A RECHAZADO
      const { data: updatedUser, error: updateError } = await supabase
        .from('tb_usuarios')
        .update({ 
          estado: 'rechazado',
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('usuario_id', targetUserId) // ← CAMBIAR a usuario_id
        .eq('rol', rol)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error rechazando usuario:', updateError);
        return res.status(400).json({
          success: false,
          error: 'Error rechazando usuario: ' + updateError.message
        });
      }

      console.log(`✅ ${rol} rechazado por admin:`, targetUserId, motivo ? `Motivo: ${motivo}` : '');

      res.json({
        success: true,
        message: `${rol} rechazado${motivo ? `: ${motivo}` : ''}`,
        user: updatedUser
      });

    } catch (error) {
      console.error('💥 Error en rejectUser:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // ✅ OBTENER ESTADÍSTICAS GENERALES
  async getStats(req, res) {
    try {
      const userId = req.user.usuario_id; // ← CAMBIAR a usuario_id

      // Verificar que es admin
      const { data: adminUser } = await supabase
        .from('tb_usuarios')
        .select('rol')
        .eq('usuario_id', userId) // ← CAMBIAR a usuario_id
        .single();

      if (adminUser?.rol !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'No autorizado'
        });
      }

      // Obtener conteos usando la nueva estructura
      const [
        { count: totalRestaurants },
        { count: totalDelivery },
        { count: totalClients },
        { count: totalOrders },
        { count: pendingApproval }
      ] = await Promise.all([
        // Restaurantes activos
        supabase.from('tb_usuarios')
          .select('usuario_id', { count: 'exact', head: true })
          .eq('rol', 'restaurante')
          .eq('estado', 'activo'),
        
        // Repartidores activos
        supabase.from('tb_usuarios')
          .select('usuario_id', { count: 'exact', head: true })
          .eq('rol', 'repartidor')
          .eq('estado', 'activo'),
        
        // Clientes activos
        supabase.from('tb_usuarios')
          .select('usuario_id', { count: 'exact', head: true })
          .eq('rol', 'cliente')
          .eq('estado', 'activo'),
        
        // Total pedidos
        supabase.from('tb_pedidos')
          .select('pedido_id', { count: 'exact', head: true }),
        
        // Pendientes de aprobación
        supabase.from('tb_usuarios')
          .select('usuario_id', { count: 'exact', head: true })
          .eq('estado', 'pendiente_aprobacion')
      ]);

      // Obtener pedidos del día
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayOrders } = await supabase
        .from('tb_pedidos')
        .select('pedido_id', { count: 'exact', head: true })
        .gte('fecha_creacion', today.toISOString());

      res.json({
        success: true,
        stats: {
          totalRestaurants: totalRestaurants || 0,
          totalDelivery: totalDelivery || 0,
          totalClients: totalClients || 0,
          totalOrders: totalOrders || 0,
          pendingApproval: pendingApproval || 0,
          todayOrders: todayOrders || 0
        }
      });

    } catch (error) {
      console.error('💥 Error en getStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // ✅ NUEVO: OBTENER DETALLES DE USUARIO ESPECÍFICO
  async getUserDetails(req, res) {
    try {
      const userId = req.user.usuario_id;
      const { targetUserId } = req.params;

      // Verificar que es admin
      const { data: adminUser } = await supabase
        .from('tb_usuarios')
        .select('rol')
        .eq('usuario_id', userId)
        .single();

      if (adminUser?.rol !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'No autorizado'
        });
      }

      // Obtener usuario
      const { data: user, error: userError } = await supabase
        .from('tb_usuarios')
        .select('*')
        .eq('usuario_id', targetUserId)
        .single();

      if (userError || !user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      let userDetails = { ...user };

      // Obtener datos específicos según el rol
      if (user.rol === 'restaurante') {
        const { data: restaurante } = await supabase
          .from('tb_restaurantes')
          .select('*')
          .eq('usuario_id', targetUserId)
          .single();
        userDetails = { ...userDetails, ...restaurante };
      } else if (user.rol === 'repartidor') {
        const { data: repartidor } = await supabase
          .from('tb_repartidores')
          .select('*')
          .eq('usuario_id', targetUserId)
          .single();
        userDetails = { ...userDetails, ...repartidor };
      } else if (user.rol === 'cliente') {
        const { data: cliente } = await supabase
          .from('tb_clientes')
          .select('*')
          .eq('usuario_id', targetUserId)
          .single();
        userDetails = { ...userDetails, ...cliente };
      }

      res.json({
        success: true,
        user: userDetails
      });

    } catch (error) {
      console.error('💥 Error en getUserDetails:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
};