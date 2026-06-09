import { Router } from 'express';
import { createPaymentOrder } from '../controllers/payment.controller.js';
import { protect, requireVerified } from '../middleware/auth.js';

const router = Router();

router.post('/razorpay-order', protect, requireVerified, createPaymentOrder);

export default router;
