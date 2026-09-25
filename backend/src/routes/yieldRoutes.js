import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getYield } from '../controllers/yieldController.js';

const router = Router();
router.use(requireAuth);
router.get('/', getYield);

export default router;
