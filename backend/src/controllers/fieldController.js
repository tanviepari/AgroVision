import { Field, CROPS, SOILS, STAGES } from '../models/Field.js';
import { Farm } from '../models/Farm.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { publicField } from '../utils/serialize.js';
import { fieldHealth, refreshYieldForecast } from '../services/fieldInsights.js';
import { logActivity } from '../services/activity.js';
import { notifyUser } from '../services/notifications.js';
import { IrrigationSchedule } from '../models/IrrigationSchedule.js';
import { IrrigationRecord } from '../models/IrrigationRecord.js';
import { DiseaseScan } from '../models/DiseaseScan.js';
import { YieldForecast } from '../models/YieldForecast.js';
import { FieldActivity } from '../models/FieldActivity.js';
import { Notification } from '../models/Notification.js';
import { ProblemReport } from '../models/ProblemReport.js';
import { estimateIrrigation } from '../services/irrigationEstimate.js';

async function withHealth(userId, field) {
  const health = await fieldHealth(userId, field._id);
  return publicField(field, health);
}

function readFieldBody(body, { partial = false } = {}) {
  const data = {};
  const assign = (key, value) => {
    if (value !== undefined) data[key] = value;
  };
  assign('name', body.name !== undefined ? String(body.name).trim() : undefined);
  assign('crop', body.crop);
  assign('cropVariety', body.cropVariety !== undefined ? String(body.cropVariety || '').trim() : undefined);
  assign('areaAcres', body.areaAcres !== undefined ? Number(body.areaAcres) : undefined);
  assign('soilType', body.soilType);
  assign('sowingDate', body.sowingDate ? new Date(body.sowingDate) : undefined);
  assign('location', body.location !== undefined ? String(body.location).trim() : undefined);
  assign('cropStage', body.cropStage);
  assign('notes', body.notes !== undefined ? String(body.notes || '').trim() : undefined);

  if (!partial) {
    if (!data.name) throw new ApiError(400, 'Please enter a field name.');
    if (!CROPS.includes(data.crop)) throw new ApiError(400, 'Please choose a crop.');
    if (!SOILS.includes(data.soilType)) throw new ApiError(400, 'Please choose a soil type.');
    if (!STAGES.includes(data.cropStage)) throw new ApiError(400, 'Please choose the crop stage.');
    if (!data.areaAcres || data.areaAcres < 0.1) throw new ApiError(400, 'Please enter the area in acres.');
    if (!data.sowingDate || Number.isNaN(data.sowingDate.getTime())) {
      throw new ApiError(400, 'Please enter the sowing date.');
    }
    if (!data.location) throw new ApiError(400, 'Please enter the field location.');
  } else {
    if (data.crop && !CROPS.includes(data.crop)) throw new ApiError(400, 'Please choose a crop.');
    if (data.soilType && !SOILS.includes(data.soilType)) throw new ApiError(400, 'Please choose a soil type.');
    if (data.cropStage && !STAGES.includes(data.cropStage)) throw new ApiError(400, 'Please choose the crop stage.');
    if (data.areaAcres !== undefined && (!(data.areaAcres > 0))) throw new ApiError(400, 'Please enter the area in acres.');
    if (data.sowingDate && Number.isNaN(data.sowingDate.getTime())) throw new ApiError(400, 'Please enter the sowing date.');
  }
  return data;
}

async function ensureEstimateSchedule(field) {
  const existing = await IrrigationSchedule.findOne({
    user: field.user,
    field: field._id,
    status: 'scheduled',
  });
  if (existing) return;
  const estimate = estimateIrrigation({
    crop: field.crop,
    cropStage: field.cropStage,
    areaAcres: field.areaAcres,
  });
  if (!estimate) return;
  const when = new Date();
  when.setDate(when.getDate() + 1);
  when.setHours(6, 0, 0, 0);
  await IrrigationSchedule.create({
    user: field.user,
    field: field._id,
    scheduledAt: when,
    amountLiters: estimate.waterNeededLiters,
    status: 'scheduled',
    isEstimate: true,
  });
}

export const createField = asyncHandler(async (req, res) => {
  const data = readFieldBody(req.body);
  let farm = null;
  if (req.body.farmId) {
    farm = await Farm.findOne({ _id: req.body.farmId, user: req.user._id });
  } else {
    farm = await Farm.findOne({ user: req.user._id }).sort({ createdAt: 1 });
  }
  if (!farm) {
    const farmName = String(req.body.farmName || '').trim();
    if (!farmName) throw new ApiError(400, 'Please enter a farm name.');
    farm = await Farm.create({
      user: req.user._id,
      name: farmName,
      location: data.location,
      state: req.user.state,
      district: req.user.district,
    });
  } else if (req.body.farmName) {
    farm.name = String(req.body.farmName).trim();
    await farm.save();
  }

  if (req.body.farmerName) req.user.name = String(req.body.farmerName).trim();
  if (data.location) req.user.location = data.location;
  await req.user.save();

  const field = await Field.create({ ...data, user: req.user._id, farm: farm._id });
  await logActivity({
    user: req.user._id,
    field: field._id,
    type: 'stage',
    title: 'Field added',
    detail: `${field.crop} · ${field.areaAcres} acres`,
  });
  await ensureEstimateSchedule(field);
  await refreshYieldForecast(field);
  res.status(201).json({ field: await withHealth(req.user._id, field), farmId: String(farm._id) });
});

export const listFields = asyncHandler(async (req, res) => {
  const fields = await Field.find({ user: req.user._id }).sort({ createdAt: 1 });
  const shaped = await Promise.all(fields.map((field) => withHealth(req.user._id, field)));
  res.json({ fields: shaped });
});

export const getField = asyncHandler(async (req, res) => {
  const field = await Field.findOne({ _id: req.params.id, user: req.user._id });
  if (!field) throw new ApiError(404, 'That field was not found.');
  res.json({ field: await withHealth(req.user._id, field) });
});

export const updateField = asyncHandler(async (req, res) => {
  const field = await Field.findOne({ _id: req.params.id, user: req.user._id });
  if (!field) throw new ApiError(404, 'That field was not found.');
  const previousStage = field.cropStage;
  const data = readFieldBody(req.body, { partial: true });
  Object.assign(field, data);
  await field.save();
  if (data.cropStage && data.cropStage !== previousStage) {
    await logActivity({
      user: req.user._id,
      field: field._id,
      type: 'stage',
      title: 'Crop stage updated',
      detail: data.cropStage,
    });
    await notifyUser({
      userId: req.user._id,
      fieldId: field._id,
      type: 'crop',
      title: 'Crop update',
      message: `${field.name} is now in the ${data.cropStage.toLowerCase()} stage.`,
      link: '/app/field-details',
      dedupeKey: `stage:${field._id}:${data.cropStage}`,
    });
  }
  await refreshYieldForecast(field, { notify: true });
  res.json({ field: await withHealth(req.user._id, field) });
});

async function removeFieldData(userId, fieldId) {
  await Promise.all([
    IrrigationSchedule.deleteMany({ user: userId, field: fieldId }),
    IrrigationRecord.deleteMany({ user: userId, field: fieldId }),
    DiseaseScan.deleteMany({ user: userId, field: fieldId }),
    YieldForecast.deleteMany({ user: userId, field: fieldId }),
    FieldActivity.deleteMany({ user: userId, field: fieldId }),
    Notification.deleteMany({ user: userId, field: fieldId }),
    ProblemReport.deleteMany({ user: userId, field: fieldId }),
  ]);
}

export const deleteField = asyncHandler(async (req, res) => {
  const field = await Field.findOne({ _id: req.params.id, user: req.user._id });
  if (!field) throw new ApiError(404, 'That field was not found.');
  await removeFieldData(req.user._id, field._id);
  await field.deleteOne();
  res.json({ message: 'Field removed.' });
});
