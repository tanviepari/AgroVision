import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listActivities } from '../controllers/activityController.js';

const router = Router();
router.use(requireAuth);
router.get('/', listActivities);

export default router;
