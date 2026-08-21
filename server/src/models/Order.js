import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({ customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, quantity: { type: Number, required: true, min: 1 }, unitPrice: { type: Number, required: true, min: 0 } }], totalAmount: { type: Number, required: true, min: 0 }, status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' } }, { timestamps: true });
export default mongoose.model('Order', orderSchema);
