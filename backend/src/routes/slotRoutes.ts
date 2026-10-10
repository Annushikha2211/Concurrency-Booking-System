import { Router } from 'express';
import { generateSlots, getResourceSlots } from '../controllers/slotController.js';
import { protect, authorizeAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/:resourceId', getResourceSlots);
router.post('/generate', protect, authorizeAdmin, generateSlots);

export default router;