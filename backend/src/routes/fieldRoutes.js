import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createField, listFields, getField, updateField, deleteField } from '../controllers/fieldController.js';

const router = Router();
router.use(requireAuth);
router.post('/', createField);
router.get('/', listFields);
router.get('/:id', getField);
router.patch('/:id', updateField);
router.delete('/:id', deleteField);

export default router;
