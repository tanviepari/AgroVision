import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { analyseScan, saveScan, listScans, getScan } from '../controllers/scanController.js';

const router = Router();
router.use(requireAuth);
router.post('/analyse', uploadImage.single('image'), analyseScan);
router.get('/', listScans);
router.get('/:id', getScan);
router.post('/:id/save', saveScan);

export default router;
