import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  serviceRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
  subject: { type: String, required: true, trim: true, maxlength: 160 },
  details: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['open', 'resolved', 'dismissed'], default: 'open' },
  resolution: { type: String, trim: true, maxlength: 2000 },
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
complaintSchema.index({ customer: 1, status: 1 });
export default mongoose.model('Complaint', complaintSchema);
