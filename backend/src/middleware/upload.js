import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const uploadDir = path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);

function fileFilter(req, file, cb) {
  if (!allowed.has(file.mimetype)) {
    cb(new ApiError(400, 'Please upload a JPG, PNG, or WEBP photo.'));
    return;
  }
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export function imageUrl(req, file) {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    return null;
  }
  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${file.filename}`;
}

export async function storeImage(req, file) {
  const local = imageUrl(req, file);
  if (!process.env.CLOUDINARY_CLOUD_NAME) return local;

  const cloudinary = await import('cloudinary').then((mod) => mod.v2);
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const uploaded = await cloudinary.uploader.upload(file.path, { folder: 'agrovision' });
  fs.unlink(file.path, () => {});
  return uploaded.secure_url;
}
