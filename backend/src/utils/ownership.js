import { Field } from '../models/Field.js';
import { ApiError } from '../utils/ApiError.js';

export async function findOwnedField(userId, fieldId) {
  if (!fieldId) throw new ApiError(400, 'Please choose a field.');
  const field = await Field.findOne({ _id: fieldId, user: userId });
  if (!field) throw new ApiError(404, 'That field was not found.');
  return field;
}
