import { Router } from 'express';
import { createInventory, listInventory, upsertInventory } from '../controllers/inventory.controller.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, requireAdmin, listInventory);
router.post('/', protect, requireAdmin, createInventory);
router.put('/:id', protect, requireAdmin, upsertInventory);

export default router;
