import { DiseaseScan } from '../models/DiseaseScan.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { findOwnedField } from '../utils/ownership.js';
import { storeImage } from '../middleware/upload.js';
import { analyseCropImage } from '../services/diseaseDetection.js';
import { logActivity } from '../services/activity.js';
import { notifyUser } from '../services/notifications.js';
import { refreshYieldForecast } from '../services/fieldInsights.js';
import { formatDateLabel } from '../utils/dates.js';

function publicScan(scan) {
  return {
    id: String(scan._id),
    fieldId: String(scan.field),
    imageUrl: scan.imageUrl,
    status: scan.status,
    date: scan.createdAt.toISOString().slice(0, 10),
    dateLabel: formatDateLabel(scan.createdAt),
    cropName: scan.cropName,
    possibleIssue: scan.possibleIssue,
    issue: scan.possibleIssue,
    confidence: scan.confidence,
    severity: scan.confidence != null ? `${Math.round(scan.confidence * 100)}% match` : 'Possible issue',
    explanation: scan.explanation,
    symptoms: scan.symptoms,
    nextSteps: scan.nextSteps,
    treatment: scan.nextSteps,
    seekExpertWhen: scan.seekExpertWhen,
    followUp: scan.seekExpertWhen,
    disclaimer: scan.disclaimer,
    imagePreview: scan.imageUrl,
  };
}

export const analyseScan = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please choose a crop photo.');
  const field = await findOwnedField(req.user._id, req.body.fieldId);
  const imageUrl = await storeImage(req, req.file);

  try {
    const analysis = await analyseCropImage({ imageUrl, crop: field.crop });
    const scan = await DiseaseScan.create({
      user: req.user._id,
      field: field._id,
      imageUrl,
      status: 'pending_save',
      ...analysis,
    });
    res.json({ scan: publicScan(scan) });
  } catch (error) {
    await DiseaseScan.create({
      user: req.user._id,
      field: field._id,
      imageUrl,
      status: 'failed',
      errorMessage: error.message,
    });
    throw error;
  }
});

export const saveScan = asyncHandler(async (req, res) => {
  const scan = await DiseaseScan.findOne({
    _id: req.params.id,
    user: req.user._id,
    status: 'pending_save',
  });
  if (!scan || !scan.possibleIssue) {
    throw new ApiError(404, 'There is no scan result to save.');
  }
  scan.status = 'saved';
  await scan.save();
  const field = await findOwnedField(req.user._id, scan.field);
  await logActivity({
    user: req.user._id,
    field: scan.field,
    type: 'disease',
    title: 'Disease scan',
    detail: scan.possibleIssue,
    refModel: 'DiseaseScan',
    refId: scan._id,
  });
  await notifyUser({
    userId: req.user._id,
    fieldId: scan.field,
    type: 'disease',
    title: 'Crop issue',
    message: `A possible issue was recorded for ${field.name}: ${scan.possibleIssue}. This is not a confirmed diagnosis.`,
    link: '/app/history',
    dedupeKey: `scan:${scan._id}`,
  });
  await refreshYieldForecast(field, { notify: true });
  res.json({ scan: publicScan(scan) });
});

export const listScans = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id, status: 'saved' };
  if (req.query.fieldId) {
    await findOwnedField(req.user._id, req.query.fieldId);
    filter.field = req.query.fieldId;
  }
  const scans = await DiseaseScan.find(filter).sort({ createdAt: -1 });
  res.json({ scans: scans.map(publicScan) });
});

export const getScan = asyncHandler(async (req, res) => {
  const scan = await DiseaseScan.findOne({ _id: req.params.id, user: req.user._id, status: 'saved' });
  if (!scan) throw new ApiError(404, 'That scan was not found.');
  res.json({ scan: publicScan(scan) });
});
