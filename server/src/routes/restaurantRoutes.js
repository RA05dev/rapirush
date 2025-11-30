import express from 'express';
import { restaurantController } from '../controllers/restaurantController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { supabase } from '../config/supabaseClient.js';

const router = express.Router();

// ✅ RUTA DE DEBUG
router.get('/debug/restaurants-count', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tb_restaurantes')
      .select('restaurante_id, restaurante_nombre', { count: 'exact' });
    
    if (error) {
      return res.json({
        success: false,
        error: error.message,
        code: error.code
      });
    }

    res.json({
      success: true,
      count: data?.length || 0,
      firstRestaurants: data?.slice(0, 3)?.map(r => ({
        id: r.restaurante_id,
        nombre: r.restaurante_nombre
      }))
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// ✅ RUTAS PÚBLICAS
router.get('/', restaurantController.getAllRestaurants);
router.get('/search', restaurantController.searchRestaurants);
router.get('/:id', restaurantController.getRestaurantById);

// ✅ RUTAS PROTEGIDAS
router.put('/:id', authMiddleware, restaurantController.updateRestaurant);

export default router;