import { supabase } from '../config/supabaseClient.js';

export const adminController = {
  // ✅ OBTENER USUARIOS PENDIENTES (Restaurantes y Repartidores)
  async getPendingUsers(req, res) {
    try {
      const userId = req.user.id;

      // ✅ VERIFICAR que es admin
      const { data: adminUser, error: adminError } = await supabase
        .from('usuarios')
        .select('rol, estado')
        .eq('id', userId)
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
        .from('usuarios')
        .select(`
          id,
          rol,
          estado,
          restaurantes (
            nombre,
            telefono,
            direccion,
            etiquetas
          )
        `)
        .eq('rol', 'restaurante')
        .eq('estado', 'pendiente')
        .order('creado_en', { ascending: false });

      if (restError) {
        console.error('❌ Error obteniendo restaurantes:', restError);
      }

      // ✅ OBTENER REPARTIDORES PENDIENTES
      const { data: pendingDelivery, error: delError } = await supabase
        .from('usuarios')
        .select(`
          id,
          rol,
          estado,
          repartidores (
            nombre,
            telefono,
            tipo_vehiculo
          )
        `)
        .eq('rol', 'repartidor')
        .eq('estado', 'pendiente')
        .order('creado_en', { ascending: false });

      if (delError) {
        console.error('❌ Error obteniendo repartidores:', delError);
      }

      res.json({
        success: true,
        pendingRestaurants: pendingRestaurants || [],
        pendingDelivery: pendingDelivery || []
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
      const userId = req.user.id;
      const { targetUserId, rol } = req.body;

      // ✅ VERIFICAR que es admin
      const { data: adminUser, error: adminError } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', userId)
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

      // ✅ CAMBIAR ESTADO A APROBADO
      const { data: updated, error: updateError } = await supabase
        .from('usuarios')
        .update({ estado: 'aprobado' })
        .eq('id', targetUserId)
        .eq('rol', rol)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error aprobando usuario:', updateError);
        return res.status(400).json({
          success: false,
          error: 'Error aprobando usuario'
        });
      }

      console.log(`✅ ${rol} aprobado por admin:`, targetUserId);

      res.json({
        success: true,
        message: `${rol} aprobado exitosamente`,
        user: updated
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
      const userId = req.user.id;
      const { targetUserId, rol } = req.body;

      // ✅ VERIFICAR que es admin
      const { data: adminUser, error: adminError } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', userId)
        .single();

      if (adminError || adminUser?.rol !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'No autorizado'
        });
      }

      // ✅ CAMBIAR ESTADO A RECHAZADO
      const { data: updated, error: updateError } = await supabase
        .from('usuarios')
        .update({ estado: 'rechazado' })
        .eq('id', targetUserId)
        .eq('rol', rol)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error rechazando usuario:', updateError);
        return res.status(400).json({
          success: false,
          error: 'Error rechazando usuario'
        });
      }

      console.log(`✅ ${rol} rechazado por admin:`, targetUserId);

      res.json({
        success: true,
        message: `${rol} rechazado`,
        user: updated
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
      const userId = req.user.id;

      // Verificar que es admin
      const { data: adminUser } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', userId)
        .single();

      if (adminUser?.rol !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'No autorizado'
        });
      }

      // Obtener conteos
      const [
        { count: totalRestaurants },
        { count: totalDelivery },
        { count: totalClients },
        { count: totalOrders }
      ] = await Promise.all([
        supabase.from('usuarios').select('id', { count: 'exact' }).eq('rol', 'restaurante'),
        supabase.from('usuarios').select('id', { count: 'exact' }).eq('rol', 'repartidor'),
        supabase.from('usuarios').select('id', { count: 'exact' }).eq('rol', 'cliente'),
        supabase.from('pedidos').select('id', { count: 'exact' })
      ]);

      res.json({
        success: true,
        stats: {
          totalRestaurants: totalRestaurants || 0,
          totalDelivery: totalDelivery || 0,
          totalClients: totalClients || 0,
          totalOrders: totalOrders || 0
        }
      });

    } catch (error) {
      console.error('💥 Error en getStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
};
