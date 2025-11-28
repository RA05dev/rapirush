import { supabase } from '../config/supabaseClient.js';

// ✅ FUNCIÓN PARA CONVERTIR ID NUMÉRICO A UUID
function convertToUUID(restaurantId) {
    // Si ya es un UUID, devolverlo tal cual
    if (restaurantId.includes('-')) {
        return restaurantId;
    }
    
    // Si es numérico, convertirlo a UUID
    const idNum = parseInt(restaurantId);
    if (!isNaN(idNum)) {
        // Mapeo basado en tu función getSimpleRestaurantId
        const uuidMap = {
            1: '10000000-0000-0000-0000-000000000001',
            2: '20000000-0000-0000-0000-000000000002', 
            3: '30000000-0000-0000-0000-000000000003',
            4: '40000000-0000-0000-0000-000000000004',
            5: '50000000-0000-0000-0000-000000000005',
            6: '60000000-0000-0000-0000-000000000006',
            7: '70000000-0000-0000-0000-000000000007',
            8: '80000000-0000-0000-0000-000000000008', 
            9: '90000000-0000-0000-0000-000000000009',
            10: 'a0000000-0000-0000-0000-000000000010',
            11: 'b0000000-0000-0000-0000-000000000011',
            12: 'c0000000-0000-0000-0000-000000000012',
            13: 'd0000000-0000-0000-0000-000000000013',
            14: 'e0000000-0000-0000-0000-000000000014',
            15: 'f0000000-0000-0000-0000-000000000015'
        };
        return uuidMap[idNum] || restaurantId;
    }
    
    return restaurantId;
}

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
        .from('restaurantes')
        .select('id, nombre, descripcion, etiquetas, rating, reviews, tiempo_delivery, delivery_cost, direccion, abierto, image_url', { count: 'exact' })
        .order('nombre')
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('❌ Error en Supabase:', error);
        return res.status(500).json({
          success: false,
          error: 'Error al obtener restaurantes de la base de datos'
        });
      }

      console.log(`📥 Restaurantes obtenidos: ${data?.length || 0} de ${count}`);
      
      // Transformar datos para el frontend
      const restaurants = data.map(restaurant => ({
        id: restaurant.id,
        name: restaurant.nombre,
        description: restaurant.descripcion || '',
        categories: restaurant.etiquetas ? restaurant.etiquetas.split(',') : [],
        rating: restaurant.rating || 4.5,
        reviews: restaurant.reviews || 0,
        deliveryTime: `${restaurant.tiempo_delivery || 30} min`,
        deliveryCost: restaurant.delivery_cost || 2.50,
        location: restaurant.direccion || 'Lima, Perú',
        isOpen: restaurant.abierto !== false,
        img: restaurant.image_url || 'assets/Img/basedatos.png'
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
        let restaurantId = req.params.id; // ✅ Usar let
        console.log(`📤 Obteniendo restaurante ID: ${restaurantId}`);

        // ✅ CONVERTIR ID NUMÉRICO A UUID
        restaurantId = convertToUUID(restaurantId);
        console.log(`🔄 ID convertido: ${restaurantId}`);

        const { data, error } = await supabase
            .from('restaurantes')
            .select('*')
            .eq('id', restaurantId)
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
            id: data.id,
            name: data.nombre,
            description: data.descripcion || '',
            categories: data.etiquetas ? data.etiquetas.split(',') : [],
            rating: data.rating || 4.5,
            reviews: data.reviews || 0,
            deliveryTime: `${data.tiempo_delivery || 30} min`,
            deliveryCost: data.delivery_cost || 2.50,
            location: data.direccion || 'Lima, Perú',
            isOpen: data.abierto !== false,
            img: data.image_url || 'assets/Img/basedatos.png',
            telefono: data.telefono,
            direccion: data.direccion
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
        .from('restaurantes')  // ✅ CORREGIDO
        .select('*');

      // Aplicar filtros
      if (query) {
        supabaseQuery = supabaseQuery.or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%,etiquetas.ilike.%${query}%`);
      }

      if (category) {
        supabaseQuery = supabaseQuery.ilike('etiquetas', `%${category}%`);
      }

      const { data, error } = await supabaseQuery.order('nombre');

      if (error) {
        console.error('❌ Error en Supabase:', error);
        return res.status(500).json({
          success: false,
          error: 'Error al buscar restaurantes'
        });
      }

      // Transformar datos (USANDO CAMPOS REALES)
      const restaurants = data.map(restaurant => ({
        id: restaurant.id,
        name: restaurant.nombre,
        description: restaurant.descripcion || '',
        categories: restaurant.etiquetas ? restaurant.etiquetas.split(',') : [],
        rating: restaurant.rating || 4.5,
        reviews: restaurant.reviews || 0,
        deliveryTime: `${restaurant.tiempo_delivery || 30} min`,
        deliveryCost: restaurant.delivery_cost || 2.50,
        location: restaurant.direccion || 'Lima, Perú',
        isOpen: restaurant.abierto !== false,
        img: restaurant.image_url || 'assets/Img/basedatos.png'
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
  }
};