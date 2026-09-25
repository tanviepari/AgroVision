import mongoose from 'mongoose';

const TYPES = ['scan', 'disease', 'problem', 'irrigation', 'recommendation', 'yield', 'stage'];

const fieldActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true, index: true },
    type: { type: String, required: true, enum: TYPES },
    title: { type: String, required: true, maxlength: 140 },
    detail: { type: String, default: '', maxlength: 300 },
    occurredAt: { type: Date, required: true, default: Date.now },
    refModel: { type: String, default: '' },
    refId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

fieldActivitySchema.index({ user: 1, field: 1, occurredAt: -1 });
fieldActivitySchema.index({ user: 1, field: 1, type: 1, occurredAt: -1 });

export const FieldActivity = mongoose.model('FieldActivity', fieldActivitySchema);
export { TYPES as ACTIVITY_TYPES };
