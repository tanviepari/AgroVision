import { Farm } from '../models/Farm.js';
import { Field } from '../models/Field.js';
import { IrrigationSchedule } from '../models/IrrigationSchedule.js';
import { IrrigationRecord } from '../models/IrrigationRecord.js';
import { DiseaseScan } from '../models/DiseaseScan.js';
import { YieldForecast } from '../models/YieldForecast.js';
import { FieldActivity } from '../models/FieldActivity.js';
import { Notification } from '../models/Notification.js';
import { ProblemReport } from '../models/ProblemReport.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { publicFarm } from '../utils/serialize.js';

export const createFarm = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name) throw new ApiError(400, 'Please enter a farm name.');
  const farm = await Farm.create({
    user: req.user._id,
    name,
    location: String(req.body.location || req.user.location || '').trim(),
    state: String(req.body.state || req.user.state || '').trim(),
    district: String(req.body.district || req.user.district || '').trim(),
  });
  res.status(201).json({ farm: publicFarm(farm) });
});

export const listFarms = asyncHandler(async (req, res) => {
  const farms = await Farm.find({ user: req.user._id }).sort({ createdAt: 1 });
  res.json({ farms: farms.map(publicFarm) });
});

export const updateFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.id, user: req.user._id });
  if (!farm) throw new ApiError(404, 'That farm was not found.');
  if (req.body.name !== undefined) farm.name = String(req.body.name).trim();
  if (req.body.location !== undefined) farm.location = String(req.body.location).trim();
  if (req.body.state !== undefined) farm.state = String(req.body.state).trim();
  if (req.body.district !== undefined) farm.district = String(req.body.district).trim();
  if (!farm.name) throw new ApiError(400, 'Please enter a farm name.');
  await farm.save();
  res.json({ farm: publicFarm(farm) });
});

export const deleteFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.id, user: req.user._id });
  if (!farm) throw new ApiError(404, 'That farm was not found.');
  const fields = await Field.find({ user: req.user._id, farm: farm._id }).select('_id');
  const ids = fields.map((item) => item._id);
  await Promise.all([
    Field.deleteMany({ user: req.user._id, farm: farm._id }),
    IrrigationSchedule.deleteMany({ user: req.user._id, field: { $in: ids } }),
    IrrigationRecord.deleteMany({ user: req.user._id, field: { $in: ids } }),
    DiseaseScan.deleteMany({ user: req.user._id, field: { $in: ids } }),
    YieldForecast.deleteMany({ user: req.user._id, field: { $in: ids } }),
    FieldActivity.deleteMany({ user: req.user._id, field: { $in: ids } }),
    Notification.deleteMany({ user: req.user._id, field: { $in: ids } }),
    ProblemReport.deleteMany({ user: req.user._id, field: { $in: ids } }),
  ]);
  await farm.deleteOne();
  res.json({ message: 'Farm removed.' });
});
