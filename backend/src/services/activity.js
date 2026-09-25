import { FieldActivity } from '../models/FieldActivity.js';

export async function logActivity(payload) {
  return FieldActivity.create({
    occurredAt: payload.occurredAt || new Date(),
    ...payload,
  });
}
