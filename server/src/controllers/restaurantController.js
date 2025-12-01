import { supabase } from '../config/supabaseClient.js';

export const restaurantController = {
  // ✅ OBTENER TODOS LOS RESTAURANTES (OPTIMIZADO CON PAGINACIÓN)
  async getAllRestaurants(req, res) {
    try {
      console.log('📤 Obteniendo todos los restaurantes desde Supabase...');
      
      // Parámetros de paginación
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const offset = (page - 1) * limit;

      // ✅ OPTIMIZACIÓN: Seleccionar solo campos necesarios
      const { data, error, count } = await supabase
        .from('tb_restaurantes')
        .select('restaurante_id, restaurante_nombre, restaurante_descripcion, restaurante_url, tipo_comida, tiempo_delivery, delivery_cost, calificacion_promedio, numero_reviews, restaurante_telefono, restaurante_direccion, es_abierto, fecha_creacion', { count: 'exact' })
        .order('restaurante_nombre')
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('❌ Error en Supabase:', error);
        return res.status(500).json({
          success: false,
          error: 'Error al obtener restaurantes de la base de datos'
        });
      }

      console.log(`📥 Restaurantes obtenidos: ${data?.length || 0} de ${count}`);
      console.log('🔍 Datos crudos:', JSON.stringify(data?.slice(0, 2)));
      
      // Transformar datos para el frontend
      const restaurants = data.map(restaurant => ({
        id: restaurant.restaurante_id,
        name: restaurant.restaurante_nombre,
        description: restaurant.restaurante_descripcion || '',
        img: restaurant.restaurante_url || 'assets/Img/basedatos.png',
        tipo_comida: restaurant.tipo_comida || 'Comida',
        rating: restaurant.calificacion_promedio || 4.5,
        reviews: restaurant.numero_reviews || 0,
        deliveryTime: restaurant.tiempo_delivery ? `${restaurant.tiempo_delivery} min` : '30-45 min',
        deliveryCost: restaurant.delivery_cost || 5,
        location: restaurant.restaurante_direccion || 'Lima, Perú',
        isOpen: restaurant.es_abierto !== false
      }));

      res.json({
        success: true,
        data: restaurants,
        count: restaurants.length,
        total: count,
        page: page,
        pages: Math.ceil(count / limit)
      });

    } catch (error) {
      console.error('💥 Error en controller:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // ✅ OBTENER RESTAURANTE POR ID
  async getRestaurantById(req, res) {
    try {
        const restaurantId = req.params.id;
        console.log(`📤 Obteniendo restaurante ID: ${restaurantId}`);
        
        // ✅ USAR EL ID DIRECTAMENTE, SIN CONVERTIR
        const { data, error } = await supabase
            .from('tb_restaurantes')
            .select('*')
            .eq('restaurante_id', restaurantId)
            .single();

        if (error) {
            console.error('❌ Error en Supabase:', error);
            return res.status(404).json({
                success: false,
                error: 'Restaurante no encontrado'
            });
        }

        if (!data) {
            return res.status(404).json({
                success: false,
                error: 'Restaurante no encontrado'
            });
        }

        // Transformar datos (USANDO CAMPOS REALES)
        const restaurant = {
            id: data.restaurante_id,
            name: data.restaurante_nombre,
            description: data.restaurante_descripcion || '',
            img: data.restaurante_url || 'assets/Img/basedatos.png',
            tipo_comida: data.tipo_comida || 'Comida',
            rating: data.calificacion_promedio || 4.5,
            reviews: data.numero_reviews || 0,
            deliveryTime: data.tiempo_delivery ? `${data.tiempo_delivery} min` : '30-45 min',
            deliveryCost: data.delivery_cost || 5,
            location: data.restaurante_direccion || 'Lima, Perú',
            isOpen: data.es_abierto !== false,
            es_abierto: data.es_abierto,
            telefono: data.restaurante_telefono,
            direccion: data.restaurante_direccion
        };

        res.json({
            success: true,
            data: restaurant
        });

    } catch (error) {
        console.error('💥 Error en controller:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
  },

  // ✅ BUSCAR RESTAURANTES
  async searchRestaurants(req, res) {
    try {
      const { query, category } = req.query;
      console.log(`🔍 Buscando restaurantes - query: ${query}, category: ${category}`);

      let supabaseQuery = supabase
        .from('tb_restaurantes')
        .select('*');

      // Aplicar filtros
      if (query) {
        supabaseQuery = supabaseQuery.or(`restaurante_nombre.ilike.%${query}%,restaurante_descripcion.ilike.%${query}%,tipo_comida.ilike.%${query}%`);
      }

      // ✅ BUSCAR POR tipo_comida EN LUGAR DE categoria_id (que es UUID)
      if (category) {
        supabaseQuery = supabaseQuery.ilike('tipo_comida', `%${category}%`);
      }

      const { data, error } = await supabaseQuery.order('restaurante_nombre');

      if (error) {
        console.error('❌ Error en Supabase:', error);
        return res.status(500).json({
          success: false,
          error: 'Error al buscar restaurantes'
        });
      }

      // Transformar datos (USANDO CAMPOS REALES)
      const restaurants = data.map(restaurant => ({
        id: restaurant.restaurante_id,
        name: restaurant.restaurante_nombre,
        description: restaurant.restaurante_descripcion || '',
        img: restaurant.restaurante_url || 'assets/Img/basedatos.png',
        tipo_comida: restaurant.tipo_comida || 'Comida',
        rating: restaurant.calificacion_promedio || 4.5,
        reviews: restaurant.numero_reviews || 0,
        deliveryTime: restaurant.tiempo_delivery ? `${restaurant.tiempo_delivery} min` : '30-45 min',
        deliveryCost: restaurant.delivery_cost || 5,
        location: restaurant.restaurante_direccion || 'Lima, Perú',
        isOpen: restaurant.es_abierto !== false
      }));

      res.json({
        success: true,
        data: restaurants,
        count: restaurants.length
      });

    } catch (error) {
      console.error('💥 Error en controller:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // ✅ ACTUALIZAR RESTAURANTE
  async updateRestaurant(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.usuario_id;
      const restaurantId = id;
      const updates = req.body;

      console.log(`📝 Actualizando restaurante ${restaurantId} por usuario ${userId}`);

      // 1. Verificar que el restaurante existe y pertenece al usuario
      const { data: restaurant, error: fetchError } = await supabase
        .from('tb_restaurantes')
        .select('*')
        .eq('restaurante_id', restaurantId)
        .single();

      if (fetchError || !restaurant) {
        return res.status(404).json({
          success: false,
          error: 'Restaurante no encontrado'
        });
      }

      // ✅ CORRECCIÓN: Verificar propiedad usando usuario_id
      if (restaurant.usuario_id !== userId) {
        console.warn('❌ No autorizado: restaurante.usuario_id:', restaurant.usuario_id, 'userId:', userId);
        return res.status(403).json({
          success: false,
          error: 'No autorizado para actualizar este restaurante'
        });
      }

      // 2. Actualizar los campos permitidos
      const allowedFields = ['restaurante_nombre', 'restaurante_descripcion', 'restaurante_direccion', 'restaurante_telefono', 'restaurante_url', 'tipo_comida', 'tiempo_delivery', 'delivery_cost', 'es_abierto'];
      const updateData = {};
      
      allowedFields.forEach(field => {
        if (field in updates) {
          updateData[field] = updates[field];
        }
      });

      // ✅ AGREGAR fecha_actualizacion automáticamente
      updateData.fecha_actualizacion = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('tb_restaurantes')
        .update(updateData)
        .eq('restaurante_id', restaurantId);

      if (updateError) {
        return res.status(400).json({
          success: false,
          error: 'Error al actualizar restaurante: ' + updateError.message
        });
      }

      console.log(`✅ Restaurante ${restaurantId} actualizado`);

      res.json({
        success: true,
        message: 'Restaurante actualizado exitosamente',
        restaurant: {
          id: restaurantId,
          ...updateData
        }
      });

    } catch (error) {
      console.error('💥 Error en updateRestaurant:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // ✅ ACTUALIZAR ESTADO DEL RESTAURANTE (ABIERTO/CERRADO)
  async updateEstado(req, res) {
    try {
      const userId = req.user.usuario_id;
      const { es_abierto } = req.body;

      console.log(`🔄 Actualizando estado restaurante para usuario: ${userId}`);
      console.log(`📊 Nuevo estado: ${es_abierto}`);

      if (typeof es_abierto !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'es_abierto debe ser un valor booleano'
        });
      }

      // 1. Obtener restaurante_id del usuario
      const { data: restaurante, error: fetchError } = await supabase
        .from('tb_restaurantes')
        .select('restaurante_id, usuario_id, es_abierto')
        .eq('usuario_id', userId)
        .single();

      if (fetchError || !restaurante) {
        return res.status(404).json({
          success: false,
          error: 'Restaurante no encontrado'
        });
      }

      // ✅ Verificar autorización
      if (restaurante.usuario_id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'No autorizado para actualizar este restaurante'
        });
      }

      // 2. Actualizar estado
      const { error: updateError } = await supabase
        .from('tb_restaurantes')
        .update({ 
          es_abierto: es_abierto,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('restaurante_id', restaurante.restaurante_id);

      if (updateError) {
        return res.status(400).json({
          success: false,
          error: 'Error al actualizar estado: ' + updateError.message
        });
      }

      console.log(`✅ Estado del restaurante ${restaurante.restaurante_id} actualizado a: ${es_abierto}`);

      res.json({
        success: true,
        message: `Restaurante ahora está ${es_abierto ? 'ABIERTO' : 'CERRADO'}`,
        es_abierto: es_abierto
      });

    } catch (error) {
      console.error('💥 Error en updateEstado:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}