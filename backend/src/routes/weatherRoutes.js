import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getWeather } from '../controllers/weatherController.js';

const router = Router();
router.get('/', requireAuth, getWeather);

export default router;
