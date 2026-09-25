import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    next(new ApiError(400, result.array()[0].msg));
    return;
  }
  next();
}
