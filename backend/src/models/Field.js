import mongoose from 'mongoose';

const CROPS = ['Tomato', 'Cotton', 'Wheat', 'Rice', 'Sugarcane'];
const SOILS = ['Loamy', 'Clay', 'Sandy', 'Silty', 'Peaty'];
const STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity', 'Harvest ready'];

const fieldSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    crop: { type: String, required: true, enum: CROPS },
    cropVariety: { type: String, trim: true, default: '', maxlength: 80 },
    areaAcres: { type: Number, required: true, min: 0.1, max: 10000 },
    soilType: { type: String, required: true, enum: SOILS },
    sowingDate: { type: Date, required: true },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    cropStage: { type: String, required: true, enum: STAGES },
    notes: { type: String, trim: true, default: '', maxlength: 500 },
  },
  { timestamps: true }
);

fieldSchema.index({ user: 1, farm: 1 });

export const Field = mongoose.model('Field', fieldSchema);
export { CROPS, SOILS, STAGES };
