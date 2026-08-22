import { Router } from 'express';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import { protect, authorize } from '../middleware/auth.js';
import { ownProfile } from './entrepreneurRoutes.js';
const router = Router();
async function profileFor(req, res) { const profile = await ownProfile(req.user._id); if (!profile) { res.status(404).json({ message: 'Entrepreneur profile not found.' }); return null; } return profile; }
async function validCategory(id) { return Boolean(await Category.exists({ _id: id, isActive: true })); }
router.get('/mine', protect, authorize('entrepreneur'), async (req, res, next) => { try { const profile = await profileFor(req, res); if (profile) res.json(await Service.find({ entrepreneur: profile._id }).populate('category', 'name')); } catch (error) { next(error); } });
router.post('/', protect, authorize('entrepreneur'), async (req, res, next) => { try { const profile = await profileFor(req, res); if (!profile) return; const { name, description, price, category, isAvailable } = req.body; if (!name || price === undefined || !category) return res.status(400).json({ message: 'Name, price, and category are required.' }); if (!(await validCategory(category))) return res.status(400).json({ message: 'Invalid category.' }); res.status(201).json(await Service.create({ entrepreneur: profile._id, name, description, price, category, isAvailable })); } catch (error) { next(error); } });
router.put('/:id', protect, authorize('entrepreneur'), async (req, res, next) => { try { const profile = await profileFor(req, res); if (!profile) return; const service = await Service.findOne({ _id: req.params.id, entrepreneur: profile._id }); if (!service) return res.status(404).json({ message: 'Service not found.' }); if (req.body.category && !(await validCategory(req.body.category))) return res.status(400).json({ message: 'Invalid category.' }); ['name', 'description', 'price', 'category', 'isAvailable'].forEach((key) => { if (req.body[key] !== undefined) service[key] = req.body[key]; }); await service.save(); res.json(service); } catch (error) { next(error); } });
router.delete('/:id', protect, authorize('entrepreneur'), async (req, res, next) => { try { const profile = await profileFor(req, res); if (!profile) return; const deleted = await Service.findOneAndDelete({ _id: req.params.id, entrepreneur: profile._id }); if (!deleted) return res.status(404).json({ message: 'Service not found.' }); res.status(204).end(); } catch (error) { next(error); } });
export default router;
