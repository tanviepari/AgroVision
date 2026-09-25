import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getRecommendation,
  createRecord,
  listRecords,
  createSchedule,
  updateSchedule,
  completeSchedule,
} from '../controllers/irrigationController.js';

const router = Router();
router.use(requireAuth);
router.get('/recommendation', getRecommendation);
router.post('/records', createRecord);
router.get('/records', listRecords);
router.post('/schedules', createSchedule);
router.patch('/schedules/:id', updateSchedule);
router.post('/schedules/:id/complete', completeSchedule);

export default router;
