import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { 
  createOrder, 
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  getOrdersByRestaurant,
  getOrdersByRepartidor,
  assignRepartidor
} from '../controllers/orderController.js';

const router = express.Router();

// ✅ RUTAS PROTEGIDAS
router.post('/create', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getOrdersByUser);
router.get('/restaurant', authMiddleware, getOrdersByRestaurant); // ✅ CORREGIDO: Sin parámetro
router.get('/repartidor', authMiddleware, getOrdersByRepartidor); // ✅ CORREGIDO: Sin parámetro
router.get('/:orderId', authMiddleware, getOrderById);
router.put('/:orderId/status', authMiddleware, updateOrderStatus);
router.post('/:orderId/assign-repartidor', authMiddleware, assignRepartidor); // ✅ NUEVA: Asignar repartidor

export default router;