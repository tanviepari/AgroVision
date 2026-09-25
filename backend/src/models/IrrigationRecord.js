import mongoose from 'mongoose';

const irrigationRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true, index: true },
    amountLiters: { type: Number, required: true, min: 1 },
    recordedAt: { type: Date, required: true },
    durationMinutes: { type: Number, min: 1, default: null },
    schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'IrrigationSchedule', default: null },
  },
  { timestamps: true }
);

irrigationRecordSchema.index({ user: 1, field: 1, recordedAt: -1 });

export const IrrigationRecord = mongoose.model('IrrigationRecord', irrigationRecordSchema);
