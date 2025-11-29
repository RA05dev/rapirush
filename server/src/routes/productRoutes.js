import express from 'express';
import { productController } from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ RUTAS PÚBLICAS - PRIMERO LAS MÁS ESPECÍFICAS
router.get('/products/restaurant/:restaurantId', productController.getProductsByRestaurant);

// ✅ RUTA PARA SOPORTAR QUERY PARAMETERS (restaurant_id query)
router.get('/products', async (req, res, next) => {
  if (req.query.restaurant_id) {
    // Si hay restaurant_id en query, redirigir a getProductsByRestaurant
    req.params.restaurantId = req.query.restaurant_id;
    return productController.getProductsByRestaurant(req, res);
  }
  next();
});

router.get('/products/:id', productController.getProductById);

// ✅ RUTAS PROTEGIDAS (requieren autenticación)
router.post('/products/create', authMiddleware, productController.createProduct);
router.put('/products/:id', authMiddleware, productController.updateProduct);
router.delete('/products/:id', authMiddleware, productController.deleteProduct);

export default router;