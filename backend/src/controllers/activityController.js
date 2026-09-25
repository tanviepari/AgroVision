import { FieldActivity, ACTIVITY_TYPES } from '../models/FieldActivity.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { findOwnedField } from '../utils/ownership.js';
import { publicActivity } from '../utils/serialize.js';

export const listActivities = asyncHandler(async (req, res) => {
  const field = await findOwnedField(req.user._id, req.query.fieldId);
  const filter = { user: req.user._id, field: field._id };
  if (req.query.type) {
    if (!ACTIVITY_TYPES.includes(req.query.type)) throw new ApiError(400, 'That activity type is not recognised.');
    filter.type = req.query.type;
  }
  if (req.query.from || req.query.to) {
    filter.occurredAt = {};
    if (req.query.from) filter.occurredAt.$gte = new Date(req.query.from);
    if (req.query.to) {
      const end = new Date(req.query.to);
      end.setHours(23, 59, 59, 999);
      filter.occurredAt.$lte = end;
    }
  }
  const items = await FieldActivity.find(filter).sort({ occurredAt: -1 }).limit(100);
  res.json({ activities: items.map(publicActivity) });
});
