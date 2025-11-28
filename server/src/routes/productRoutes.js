import express from 'express';
import { productController } from '../controllers/productController.js';

const router = express.Router();

// ✅ RUTAS PÚBLICAS
router.get('/products/restaurant/:restaurantId', productController.getProductsByRestaurant);
router.get('/products/:id', productController.getProductById);

export default router;