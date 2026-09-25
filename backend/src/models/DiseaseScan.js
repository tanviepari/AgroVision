import mongoose from 'mongoose';

const diseaseScanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true, index: true },
    imageUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending_save', 'saved', 'failed'],
      default: 'pending_save',
    },
    cropName: { type: String, default: '' },
    possibleIssue: { type: String, default: '' },
    confidence: { type: Number, min: 0, max: 1, default: null },
    explanation: { type: String, default: '' },
    symptoms: { type: [String], default: [] },
    nextSteps: { type: [String], default: [] },
    seekExpertWhen: { type: String, default: '' },
    disclaimer: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

diseaseScanSchema.index({ user: 1, field: 1, createdAt: -1 });

export const DiseaseScan = mongoose.model('DiseaseScan', diseaseScanSchema);
