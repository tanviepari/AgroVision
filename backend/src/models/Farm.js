import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    district: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const Farm = mongoose.model('Farm', farmSchema);
