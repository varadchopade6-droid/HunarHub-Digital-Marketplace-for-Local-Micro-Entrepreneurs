import mongoose from 'mongoose';

const entrepreneurSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, trim: true, maxlength: 120 },
  location: { type: String, trim: true, maxlength: 120 },
  bio: { type: String, trim: true, maxlength: 1000 },
  experience: { type: Number, min: 0, max: 80, default: 0 },
  profileImage: { type: String, trim: true, maxlength: 2048 },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
entrepreneurSchema.index({ location: 1, skills: 1, verificationStatus: 1 });
export default mongoose.model('Entrepreneur', entrepreneurSchema);
