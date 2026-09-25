import { YieldForecast } from '../models/YieldForecast.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { findOwnedField } from '../utils/ownership.js';
import { presentForecast, refreshYieldForecast } from '../services/fieldInsights.js';

export const getYield = asyncHandler(async (req, res) => {
  const field = await findOwnedField(req.user._id, req.query.fieldId);
  await refreshYieldForecast(field);
  const historyDocs = await YieldForecast.find({ user: req.user._id, field: field._id }).sort({ createdAt: 1 });
  const latest = historyDocs[historyDocs.length - 1] || null;
  res.json({ forecast: presentForecast(latest, historyDocs) });
});
