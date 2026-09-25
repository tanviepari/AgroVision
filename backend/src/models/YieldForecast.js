import mongoose from 'mongoose';

const yieldForecastSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true, index: true },
    expectedTonnes: { type: Number, required: true, min: 0 },
    harvestInDaysMin: { type: Number, required: true },
    harvestInDaysMax: { type: Number, required: true },
    cropProgress: { type: Number, required: true },
    cropStage: { type: String, required: true },
    factors: [{ id: String, label: String, value: String }],
    methodNote: { type: String, required: true },
  },
  { timestamps: true }
);

yieldForecastSchema.index({ user: 1, field: 1, createdAt: -1 });

export const YieldForecast = mongoose.model('YieldForecast', yieldForecastSchema);
