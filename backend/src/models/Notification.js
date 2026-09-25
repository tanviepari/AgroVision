import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', default: null },
    type: { type: String, required: true, enum: ['irrigation', 'disease', 'yield', 'crop'] },
    title: { type: String, required: true, maxlength: 120 },
    message: { type: String, required: true, maxlength: 300 },
    read: { type: Boolean, default: false },
    link: { type: String, default: '/app' },
    dedupeKey: { type: String, default: '' },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index(
  { user: 1, dedupeKey: 1 },
  { unique: true, partialFilterExpression: { dedupeKey: { $type: 'string', $gt: '' } } }
);

export const Notification = mongoose.model('Notification', notificationSchema);
