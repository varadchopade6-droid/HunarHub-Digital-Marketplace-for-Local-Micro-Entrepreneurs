import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';
import { ownProfile } from './entrepreneurRoutes.js';

const router = Router();
const populate = (query) => query.populate('customer', 'name email').populate('entrepreneur', 'businessName user').populate('items.product', 'name images');
const transitions = { pending: ['confirmed', 'cancelled'], confirmed: ['completed', 'cancelled'], completed: [], cancelled: [] };

router.post('/', protect, authorize('customer'), async (req, res, next) => {
  try {
    const { productId, quantity, contactName, contactPhone, deliveryAddress, notes } = req.body;
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || !contactName?.trim() || !contactPhone?.trim() || !deliveryAddress?.trim()) return res.status(400).json({ message: 'Product, quantity, name, phone, and delivery address are required.' });
    const product = await Product.findOneAndUpdate({ _id: productId, isAvailable: true, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }, { new: true }).populate('entrepreneur');
    if (!product) return res.status(409).json({ message: 'This product is unavailable or no longer has enough stock.' });
    if (!product.entrepreneur.isAvailable || product.entrepreneur.verificationStatus !== 'approved') {
      await Product.updateOne({ _id: product._id }, { $inc: { stock: quantity } });
      return res.status(409).json({ message: 'This entrepreneur is not currently available to take orders.' });
    }
    const order = await Order.create({ customer: req.user._id, entrepreneur: product.entrepreneur._id, items: [{ product: product._id, quantity, unitPrice: product.price }], totalAmount: product.price * quantity, contactName, contactPhone, deliveryAddress, notes });
    res.status(201).json(await populate(Order.findById(order._id)));
  } catch (error) { next(error); }
});
router.get('/mine', protect, authorize('customer'), async (req, res, next) => { try { res.json(await populate(Order.find({ customer: req.user._id }).sort('-createdAt'))); } catch (error) { next(error); } });
router.get('/entrepreneur', protect, authorize('entrepreneur'), async (req, res, next) => { try { const profile = await ownProfile(req.user._id); res.json(profile ? await populate(Order.find({ entrepreneur: profile._id }).sort('-createdAt')) : []); } catch (error) { next(error); } });
router.get('/:id', protect, async (req, res, next) => { try { const order = await populate(Order.findById(req.params.id)); if (!order) return res.status(404).json({ message: 'Order not found.' }); const profile = req.user.role === 'entrepreneur' ? await ownProfile(req.user._id) : null; if (req.user.role !== 'admin' && String(order.customer._id) !== String(req.user._id) && String(order.entrepreneur._id) !== String(profile?._id)) return res.status(403).json({ message: 'You do not have permission to view this order.' }); res.json(order); } catch (error) { next(error); } });
router.patch('/:id/status', protect, async (req, res, next) => {
  try {
    const { status } = req.body; const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    const profile = req.user.role === 'entrepreneur' ? await ownProfile(req.user._id) : null;
    const owner = String(order.customer) === String(req.user._id); const entrepreneur = String(order.entrepreneur) === String(profile?._id);
    if (!entrepreneur && !(owner && status === 'cancelled') && req.user.role !== 'admin') return res.status(403).json({ message: 'You cannot update this order.' });
    if (!transitions[order.status]?.includes(status)) return res.status(409).json({ message: `Cannot change an ${order.status} order to ${status}.` });
    order.status = status; await order.save();
    if (status === 'cancelled') await Promise.all(order.items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })));
    res.json(await populate(Order.findById(order._id)));
  } catch (error) { next(error); }
});
export default router;
