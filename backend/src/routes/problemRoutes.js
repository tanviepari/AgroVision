import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { createReport, listReports, getReport } from '../controllers/problemController.js';

const router = Router();
router.use(requireAuth);
router.post('/', uploadImage.single('image'), createReport);
router.get('/', listReports);
router.get('/:id', getReport);

export default router;
