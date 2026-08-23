import { Router } from 'express';
import Complaint from '../models/Complaint.js';
import Order from '../models/Order.js';
import ServiceRequest from '../models/ServiceRequest.js';
import { protect, authorize } from '../middleware/auth.js';
const router = Router();
router.post('/', protect, authorize('customer'), async (req, res, next) => { try { const { orderId, serviceRequestId, subject, details } = req.body; if ((!orderId && !serviceRequestId) || (orderId && serviceRequestId) || !subject?.trim() || !details?.trim()) return res.status(400).json({ message: 'Provide one of your transactions, a subject, and details.' }); const transaction = orderId ? await Order.findOne({ _id: orderId, customer: req.user._id }) : await ServiceRequest.findOne({ _id: serviceRequestId, customer: req.user._id }); if (!transaction) return res.status(403).json({ message: 'You can only complain about your own transaction.' }); res.status(201).json(await Complaint.create({ customer: req.user._id, ...(orderId ? { order: orderId } : { serviceRequest: serviceRequestId }), subject, details })); } catch (error) { next(error); } });
router.get('/mine', protect, authorize('customer'), async (req, res, next) => { try { res.json(await Complaint.find({ customer: req.user._id }).sort('-createdAt')); } catch (error) { next(error); } });
export default router;
