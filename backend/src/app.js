import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import fieldRoutes from './routes/fieldRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import irrigationRoutes from './routes/irrigationRoutes.js';
import yieldRoutes from './routes/yieldRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { ApiError } from './utils/ApiError.js';

export function createApp() {
  const app = express();
  const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: origins, credentials: false }));
  app.use(express.json({ limit: '1mb' }));
  app.use('/uploads', express.static(path.resolve('uploads')));

  app.get('/api/health', (req, res) => {
    const db = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ ok: true, db });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/farms', farmRoutes);
  app.use('/api/fields', fieldRoutes);
  app.use('/api/scans', scanRoutes);
  app.use('/api/irrigation', irrigationRoutes);
  app.use('/api/yield', yieldRoutes);
  app.use('/api/activities', activityRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/problems', problemRoutes);
  app.use('/api/weather', weatherRoutes);

  app.use(notFound);
  app.use((err, req, res, next) => {
    if (err?.code === 'LIMIT_FILE_SIZE') {
      next(new ApiError(400, 'Photo must be under 10MB.'));
      return;
    }
    if (err?.name === 'MulterError') {
      next(new ApiError(400, 'The photo could not be uploaded. Please try again.'));
      return;
    }
    next(err);
  });
  app.use(errorHandler);
  return app;
}
