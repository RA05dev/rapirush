import express from 'express';
import { restaurantController } from '../controllers/restaurantController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ RUTAS PÚBLICAS (no requieren autenticación)
router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurants/search', restaurantController.searchRestaurants);
router.get('/restaurants/:id', restaurantController.getRestaurantById);

// ✅ RUTAS PROTEGIDAS (requieren autenticación)
router.put('/restaurants/:id', authMiddleware, restaurantController.updateRestaurant);

export default router;