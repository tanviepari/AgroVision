import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    mobile: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    password: { type: String, required: true, select: false },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true, maxlength: 80 },
    preferredLanguage: { type: String, default: 'English' },
    termsAcceptedAt: { type: Date, required: true },
    notificationPrefs: {
      irrigation: { type: Boolean, default: true },
      disease: { type: Boolean, default: true },
      yield: { type: Boolean, default: true },
    },
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $type: 'string', $gt: '' } } });

export const User = mongoose.model('User', userSchema);
