import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimit.js';
import { requireAuth } from '../middleware/auth.js';
import {
  register,
  registerRules,
  login,
  loginRules,
  logout,
  me,
  updateProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', authLimiter, registerRules, register);
router.post('/login', authLimiter, loginRules, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);
router.patch('/profile', requireAuth, updateProfile);

export default router;
