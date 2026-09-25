import mongoose from 'mongoose';

const irrigationScheduleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true, index: true },
    scheduledAt: { type: Date, required: true },
    amountLiters: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['scheduled', 'completed'], default: 'scheduled' },
    isEstimate: { type: Boolean, default: true },
  },
  { timestamps: true }
);

irrigationScheduleSchema.index({ user: 1, field: 1, scheduledAt: 1 });

export const IrrigationSchedule = mongoose.model('IrrigationSchedule', irrigationScheduleSchema);
