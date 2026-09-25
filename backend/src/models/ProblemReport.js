import mongoose from 'mongoose';

const CATEGORIES = [
  'yellow_leaves',
  'pest',
  'drying',
  'slow_growth',
  'too_much_water',
  'not_enough_water',
  'other',
];

const problemReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true, index: true },
    category: { type: String, required: true, enum: CATEGORIES },
    label: { type: String, required: true },
    description: { type: String, trim: true, default: '', maxlength: 500 },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

problemReportSchema.index({ user: 1, field: 1, createdAt: -1 });

export const ProblemReport = mongoose.model('ProblemReport', problemReportSchema);
export { CATEGORIES };
