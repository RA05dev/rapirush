import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { 
  createOrder, 
  getOrdersByUser,
  getOrderById,
  updateOrderStatus 
} from '../controllers/orderController.js';

const router = express.Router();

// ✅ RUTAS PROTEGIDAS
router.post('/create', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getOrdersByUser);
router.get('/:orderId', authMiddleware, getOrderById);
router.put('/:orderId/status', authMiddleware, updateOrderStatus);

export default router;