import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createFarm, listFarms, updateFarm, deleteFarm } from '../controllers/farmController.js';

const router = Router();
router.use(requireAuth);
router.post('/', createFarm);
router.get('/', listFarms);
router.patch('/:id', updateFarm);
router.delete('/:id', deleteFarm);

export default router;
