import { Router } from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { protect, authorize } from '../middleware/auth.js';
import { ownProfile } from './entrepreneurRoutes.js';

const router = Router();
async function profileFor(req, res) { const profile = await ownProfile(req.user._id); if (!profile) { res.status(404).json({ message: 'Entrepreneur profile not found.' }); return null; } return profile; }
async function validCategory(id) { return Boolean(await Category.exists({ _id: id, isActive: true })); }
function listingFields(body) { const fields = ['name', 'description', 'price', 'category', 'images', 'stock', 'isAvailable']; return Object.fromEntries(fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]])); }

router.get('/', async (req, res, next) => {
  try {
    const { search, category, location, minPrice, maxPrice } = req.query;
    const filter = { isAvailable: true, stock: { $gt: 0 } };
    if (category) filter.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) filter.price = { ...(minPrice !== undefined && { $gte: Number(minPrice) }), ...(maxPrice !== undefined && { $lte: Number(maxPrice) }) };
    if (Number.isNaN(filter.price?.$gte) || Number.isNaN(filter.price?.$lte)) return res.status(400).json({ message: 'Price filters must be numbers.' });
    let products = await Product.find(filter).populate({ path: 'entrepreneur', match: { verificationStatus: { $ne: 'rejected' }, ...(location && { location: { $regex: location.trim(), $options: 'i' } }) }, populate: [{ path: 'user', select: 'name' }] }).populate('category', 'name').sort('-createdAt');
    products = products.filter((product) => product.entrepreneur && (!search?.trim() || [product.name, product.description, product.entrepreneur.businessName, product.entrepreneur.user?.name].filter(Boolean).some((value) => value.toLowerCase().includes(search.trim().toLowerCase()))));
    res.json(products);
  } catch (error) { next(error); }
});
router.get('/mine', protect, authorize('entrepreneur'), async (req, res, next) => { try { const profile = await profileFor(req, res); if (profile) res.json(await Product.find({ entrepreneur: profile._id }).populate('category', 'name')); } catch (error) { next(error); } });
router.post('/', protect, authorize('entrepreneur'), async (req, res, next) => { try { const profile = await profileFor(req, res); if (!profile) return; const { name, price, category, stock } = req.body; if (!name || price === undefined || !category || stock === undefined) return res.status(400).json({ message: 'Name, price, category, and stock are required.' }); if (!(await validCategory(category))) return res.status(400).json({ message: 'Invalid category.' }); const fields = listingFields(req.body); if (fields.images && (!Array.isArray(fields.images) || fields.images.some((image) => typeof image !== 'string'))) return res.status(400).json({ message: 'Images must be an array of image URLs.' }); res.status(201).json(await Product.create({ entrepreneur: profile._id, ...fields })); } catch (error) { next(error); } });
router.get('/:id', async (req, res, next) => { try { const product = await Product.findOne({ _id: req.params.id, isAvailable: true, stock: { $gt: 0 } }).populate({ path: 'entrepreneur', match: { verificationStatus: { $ne: 'rejected' } }, populate: { path: 'user', select: 'name' } }).populate('category', 'name'); if (!product?.entrepreneur) return res.status(404).json({ message: 'Product not found or unavailable.' }); res.json(product); } catch (error) { next(error); } });
router.put('/:id', protect, authorize('entrepreneur'), async (req, res, next) => { try { const profile = await profileFor(req, res); if (!profile) return; const product = await Product.findOne({ _id: req.params.id, entrepreneur: profile._id }); if (!product) return res.status(404).json({ message: 'Product not found.' }); const fields = listingFields(req.body); if (fields.category && !(await validCategory(fields.category))) return res.status(400).json({ message: 'Invalid category.' }); if (fields.images && (!Array.isArray(fields.images) || fields.images.some((image) => typeof image !== 'string'))) return res.status(400).json({ message: 'Images must be an array of image URLs.' }); Object.assign(product, fields); await product.save(); res.json(product); } catch (error) { next(error); } });
router.delete('/:id', protect, authorize('entrepreneur'), async (req, res, next) => { try { const profile = await profileFor(req, res); if (!profile) return; const deleted = await Product.findOneAndDelete({ _id: req.params.id, entrepreneur: profile._id }); if (!deleted) return res.status(404).json({ message: 'Product not found.' }); res.status(204).end(); } catch (error) { next(error); } });
export default router;
