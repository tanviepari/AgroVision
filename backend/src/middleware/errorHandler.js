import { ApiError } from '../utils/ApiError.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 ? 'Something went wrong. Please try again.' : err.message || 'Request failed.';
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ message, code: err.code || undefined });
}

export function notFound(req, res, next) {
  next(new ApiError(404, 'That page or action was not found.'));
}
