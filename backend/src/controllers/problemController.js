import { ProblemReport, CATEGORIES } from '../models/ProblemReport.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { findOwnedField } from '../utils/ownership.js';
import { storeImage } from '../middleware/upload.js';
import { logActivity } from '../services/activity.js';
import { notifyUser } from '../services/notifications.js';
import { refreshYieldForecast } from '../services/fieldInsights.js';
import { formatDateLabel } from '../utils/dates.js';

const LABELS = {
  yellow_leaves: 'Yellow leaves',
  pest: 'Pest problem',
  drying: 'Crop drying',
  slow_growth: 'Slow growth',
  too_much_water: 'Too much water',
  not_enough_water: 'Not enough water',
  other: 'Other',
};

function publicReport(report) {
  return {
    id: String(report._id),
    fieldId: String(report.field),
    type: report.category,
    label: report.label,
    description: report.description,
    photo: report.imageUrl || null,
    date: report.createdAt.toISOString().slice(0, 10),
    dateLabel: formatDateLabel(report.createdAt),
  };
}

export const createReport = asyncHandler(async (req, res) => {
  const field = await findOwnedField(req.user._id, req.body.fieldId);
  const category = req.body.category;
  if (!CATEGORIES.includes(category)) throw new ApiError(400, 'Please choose a problem type.');
  let imageUrl = '';
  if (req.file) imageUrl = await storeImage(req, req.file);
  const report = await ProblemReport.create({
    user: req.user._id,
    field: field._id,
    category,
    label: LABELS[category],
    description: String(req.body.description || '').trim(),
    imageUrl,
  });
  await logActivity({
    user: req.user._id,
    field: field._id,
    type: 'problem',
    title: 'Problem reported',
    detail: LABELS[category],
    refModel: 'ProblemReport',
    refId: report._id,
  });
  await notifyUser({
    userId: req.user._id,
    fieldId: field._id,
    type: 'disease',
    title: 'Crop issue',
    message: `${LABELS[category]} was saved for ${field.name}.`,
    link: '/app/history',
    dedupeKey: `problem:${report._id}`,
  });
  await refreshYieldForecast(field, { notify: true });
  res.status(201).json({ report: publicReport(report) });
});

export const listReports = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.fieldId) {
    await findOwnedField(req.user._id, req.query.fieldId);
    filter.field = req.query.fieldId;
  }
  const reports = await ProblemReport.find(filter).sort({ createdAt: -1 });
  res.json({ reports: reports.map(publicReport) });
});

export const getReport = asyncHandler(async (req, res) => {
  const report = await ProblemReport.findOne({ _id: req.params.id, user: req.user._id });
  if (!report) throw new ApiError(404, 'That report was not found.');
  res.json({ report: publicReport(report) });
});
