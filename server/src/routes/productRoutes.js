import express from 'express';
import { productController } from '../controllers/productController.js';
import { authMiddleware, verifyRestaurantOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ RUTAS PÚBLICAS
router.get('/categories', productController.getCategories);
router.get('/restaurant/:restaurantId', productController.getProductsByRestaurant);

// ✅ RUTA PARA QUERY PARAMETERS
router.get('/', async (req, res, next) => {
  if (req.query.restaurant_id) {
    req.params.restaurantId = req.query.restaurant_id;
    return productController.getProductsByRestaurant(req, res);
  }
  next();
});

router.get('/:id', productController.getProductById);

// ✅ RUTAS PÚBLICAS - TAMAÑOS
router.get('/:productId/sizes', productController.getProductSizes);
router.get('/:productId/tamaños', productController.getProductSizes);

// ✅ RUTAS PROTEGIDAS - PRODUCTOS
router.post('/create', authMiddleware, verifyRestaurantOwner, productController.createProduct);
router.put('/:id', authMiddleware, verifyRestaurantOwner, productController.updateProduct);
router.delete('/:id', authMiddleware, verifyRestaurantOwner, productController.deleteProduct);

// ✅ RUTAS PROTEGIDAS - TAMAÑOS
router.post('/:productId/sizes', authMiddleware, verifyRestaurantOwner, productController.createProductSize);
router.put('/:productId/sizes/:sizeId', authMiddleware, verifyRestaurantOwner, productController.updateProductSize);
router.delete('/:productId/sizes/:sizeId', authMiddleware, verifyRestaurantOwner, productController.deleteProductSize);

// Alias con "tamaños"
router.post('/:productId/tamaños', authMiddleware, verifyRestaurantOwner, productController.createProductSize);
router.put('/:productId/tamaños/:sizeId', authMiddleware, verifyRestaurantOwner, productController.updateProductSize);
router.delete('/:productId/tamaños/:sizeId', authMiddleware, verifyRestaurantOwner, productController.deleteProductSize);

export default router;