import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepreneur', required: true, index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
serviceSchema.index({ category: 1, price: 1, isAvailable: 1 });
export default mongoose.model('Service', serviceSchema);
