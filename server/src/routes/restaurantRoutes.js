import express from 'express';
import { restaurantController } from '../controllers/restaurantController.js';

const router = express.Router();

// ✅ RUTAS PÚBLICAS (no requieren autenticación)
router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurants/search', restaurantController.searchRestaurants);
router.get('/restaurants/:id', restaurantController.getRestaurantById);

export default router;