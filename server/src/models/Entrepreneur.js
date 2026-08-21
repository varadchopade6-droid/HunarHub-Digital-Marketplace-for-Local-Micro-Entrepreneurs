import mongoose from 'mongoose';

const entrepreneurSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, trim: true, maxlength: 120 },
  location: { type: String, trim: true, maxlength: 120 },
  bio: { type: String, trim: true, maxlength: 1000 },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Entrepreneur', entrepreneurSchema);
