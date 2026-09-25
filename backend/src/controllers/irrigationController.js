import { IrrigationRecord } from '../models/IrrigationRecord.js';
import { IrrigationSchedule } from '../models/IrrigationSchedule.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { findOwnedField } from '../utils/ownership.js';
import { estimateIrrigation } from '../services/irrigationEstimate.js';
import { logActivity } from '../services/activity.js';
import { notifyUser } from '../services/notifications.js';
import { formatDateLabel } from '../utils/dates.js';

function publicRecord(record) {
  return {
    id: String(record._id),
    fieldId: String(record.field),
    date: new Date(record.recordedAt).toISOString().slice(0, 10),
    dateLabel: formatDateLabel(record.recordedAt),
    amountLiters: record.amountLiters,
    status: 'completed',
    durationMinutes: record.durationMinutes,
  };
}

function publicSchedule(item) {
  const when = new Date(item.scheduledAt);
  return {
    id: String(item._id),
    date: formatDateLabel(when),
    time: when.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
    scheduledAt: when.toISOString(),
    amountLiters: item.amountLiters,
    status: item.status,
    isEstimate: item.isEstimate,
  };
}

export const getRecommendation = asyncHandler(async (req, res) => {
  const field = await findOwnedField(req.user._id, req.query.fieldId);
  const estimate = estimateIrrigation({
    crop: field.crop,
    cropStage: field.cropStage,
    areaAcres: field.areaAcres,
  });
  if (!estimate) throw new ApiError(400, 'Watering guidance is not available for this crop yet.');

  const schedules = await IrrigationSchedule.find({
    user: req.user._id,
    field: field._id,
    status: 'scheduled',
  }).sort({ scheduledAt: 1 });

  const due = schedules.filter((item) => new Date(item.scheduledAt) <= new Date(Date.now() + 12 * 3600000));
  for (const item of due) {
    await notifyUser({
      userId: req.user._id,
      fieldId: field._id,
      type: 'irrigation',
      title: 'Watering needed',
      message: `${field.name} has a watering planned for ${formatDateLabel(item.scheduledAt)}.`,
      link: '/app/irrigation',
      dedupeKey: `irr:${item._id}`,
    });
  }

  const next = schedules[0];
  res.json({
    recommendation: {
      ...estimate,
      moisturePercent: null,
      moistureStatus: null,
      moistureMessage: 'No soil sensor is connected. This water amount is an estimate.',
      nextWatering: next
        ? { label: formatDateLabel(next.scheduledAt), time: publicSchedule(next).time }
        : { label: 'Not scheduled', time: '' },
      upcoming: schedules.map(publicSchedule),
    },
  });
});

export const createRecord = asyncHandler(async (req, res) => {
  const field = await findOwnedField(req.user._id, req.body.fieldId);
  const amountLiters = Number(req.body.amountLiters);
  const recordedAt = new Date(req.body.recordedAt || Date.now());
  if (!amountLiters || amountLiters < 1) throw new ApiError(400, 'Please enter the water used in litres.');
  if (Number.isNaN(recordedAt.getTime())) throw new ApiError(400, 'Please enter the date and time.');

  const record = await IrrigationRecord.create({
    user: req.user._id,
    field: field._id,
    amountLiters,
    recordedAt,
    durationMinutes: req.body.durationMinutes ? Number(req.body.durationMinutes) : null,
  });
  await logActivity({
    user: req.user._id,
    field: field._id,
    type: 'irrigation',
    title: 'Irrigation recorded',
    detail: `${amountLiters} L`,
    occurredAt: recordedAt,
    refModel: 'IrrigationRecord',
    refId: record._id,
  });
  res.status(201).json({ record: publicRecord(record) });
});

export const listRecords = asyncHandler(async (req, res) => {
  const field = await findOwnedField(req.user._id, req.query.fieldId);
  const records = await IrrigationRecord.find({ user: req.user._id, field: field._id }).sort({ recordedAt: -1 });
  res.json({ records: records.map(publicRecord) });
});

export const createSchedule = asyncHandler(async (req, res) => {
  const field = await findOwnedField(req.user._id, req.body.fieldId);
  const amountLiters = Number(req.body.amountLiters);
  const scheduledAt = new Date(req.body.scheduledAt);
  if (!amountLiters || amountLiters < 1) throw new ApiError(400, 'Please enter the water amount in litres.');
  if (Number.isNaN(scheduledAt.getTime())) throw new ApiError(400, 'Please choose a date and time.');
  const schedule = await IrrigationSchedule.create({
    user: req.user._id,
    field: field._id,
    amountLiters,
    scheduledAt,
    isEstimate: false,
  });
  res.status(201).json({ schedule: publicSchedule(schedule) });
});

export const updateSchedule = asyncHandler(async (req, res) => {
  const schedule = await IrrigationSchedule.findOne({ _id: req.params.id, user: req.user._id });
  if (!schedule) throw new ApiError(404, 'That watering plan was not found.');
  if (req.body.amountLiters !== undefined) schedule.amountLiters = Number(req.body.amountLiters);
  if (req.body.scheduledAt !== undefined) schedule.scheduledAt = new Date(req.body.scheduledAt);
  if (!schedule.amountLiters || schedule.amountLiters < 1) throw new ApiError(400, 'Please enter the water amount in litres.');
  if (Number.isNaN(new Date(schedule.scheduledAt).getTime())) throw new ApiError(400, 'Please choose a date and time.');
  await schedule.save();
  res.json({ schedule: publicSchedule(schedule) });
});

export const completeSchedule = asyncHandler(async (req, res) => {
  const schedule = await IrrigationSchedule.findOne({ _id: req.params.id, user: req.user._id, status: 'scheduled' });
  if (!schedule) throw new ApiError(404, 'That watering plan was not found.');
  const amountLiters = Number(req.body.amountLiters || schedule.amountLiters);
  const recordedAt = new Date(req.body.recordedAt || Date.now());
  const record = await IrrigationRecord.create({
    user: req.user._id,
    field: schedule.field,
    amountLiters,
    recordedAt,
    schedule: schedule._id,
  });
  schedule.status = 'completed';
  await schedule.save();
  await logActivity({
    user: req.user._id,
    field: schedule.field,
    type: 'irrigation',
    title: 'Irrigation completed',
    detail: `${amountLiters} L`,
    occurredAt: recordedAt,
    refModel: 'IrrigationRecord',
    refId: record._id,
  });
  res.json({ record: publicRecord(record), schedule: publicSchedule(schedule) });
});
