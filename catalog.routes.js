import { Router } from 'express';
import { getCatalog } from '../controllers/catalog.controller.js';
import { protect, requireVerified } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, requireVerified, getCatalog);

export default router;
