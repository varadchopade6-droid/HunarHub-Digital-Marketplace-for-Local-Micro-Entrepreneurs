import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({ customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepreneur', required: true }, order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, serviceRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' }, rating: { type: Number, required: true, min: 1, max: 5 }, comment: { type: String, trim: true, maxlength: 1000 } }, { timestamps: true });
reviewSchema.index({ customer: 1, order: 1 }, { unique: true, sparse: true });
reviewSchema.index({ customer: 1, serviceRequest: 1 }, { unique: true, sparse: true });
export default mongoose.model('Review', reviewSchema);
