import { Router } from 'express';
import { allOrders, createOrder, myOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { protect, requireAdmin, requireVerified } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, requireVerified, createOrder);
router.get('/mine', protect, myOrders);
router.get('/', protect, requireAdmin, allOrders);
router.put('/:id/status', protect, requireAdmin, updateOrderStatus);

export default router;
