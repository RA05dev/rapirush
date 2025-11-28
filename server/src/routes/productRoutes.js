import express from 'express';
import { productController } from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ RUTAS PÚBLICAS
router.get('/products/restaurant/:restaurantId', productController.getProductsByRestaurant);
router.get('/products/:id', productController.getProductById);

// ✅ RUTAS PROTEGIDAS (requieren autenticación)
router.post('/products/create', authMiddleware, productController.createProduct);

export default router;