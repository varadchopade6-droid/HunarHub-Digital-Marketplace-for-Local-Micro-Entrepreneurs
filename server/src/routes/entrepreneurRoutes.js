import { Router } from 'express';
import Entrepreneur from '../models/Entrepreneur.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
const populateProfile = (query) => query.populate('user', 'name').populate('skills', 'name');
async function ownProfile(userId) { return Entrepreneur.findOne({ user: userId }); }
async function validateCategories(ids = []) { const count = await Category.countDocuments({ _id: { $in: ids }, isActive: true }); return count === ids.length; }

router.get('/', async (req, res, next) => {
  try {
    const { search, category, skill, location, minPrice, maxPrice } = req.query;
    const filter = { verificationStatus: 'approved' };
    if (location) filter.location = { $regex: location.trim(), $options: 'i' };
    if (category || skill) filter.skills = category || skill;
    if (minPrice !== undefined || maxPrice !== undefined) {
      const price = { ...(minPrice !== undefined && { $gte: Number(minPrice) }), ...(maxPrice !== undefined && { $lte: Number(maxPrice) }) };
      if (Number.isNaN(price.$gte) || Number.isNaN(price.$lte) || (price.$gte !== undefined && price.$lte !== undefined && price.$gte > price.$lte)) return res.status(400).json({ message: 'Provide a valid price range.' });
      const [serviceEntrepreneurs, productEntrepreneurs] = await Promise.all([
        Service.distinct('entrepreneur', { isAvailable: true, price }),
        Product.distinct('entrepreneur', { isAvailable: true, stock: { $gt: 0 }, price })
      ]);
      filter._id = { $in: [...new Set([...serviceEntrepreneurs.map(String), ...productEntrepreneurs.map(String)])] };
    }
    let profiles = await populateProfile(Entrepreneur.find(filter).sort('-createdAt'));
    if (search?.trim()) { const term = search.trim().toLowerCase(); profiles = profiles.filter((p) => [p.businessName, p.location, p.bio, p.user?.name, ...p.skills.map((s) => s.name)].filter(Boolean).some((value) => value.toLowerCase().includes(term))); }
    res.json(profiles);
  } catch (error) { next(error); }
});

router.get('/me', protect, authorize('entrepreneur'), async (req, res, next) => { try { const profile = await populateProfile(Entrepreneur.findOne({ user: req.user._id })); res.json(profile); } catch (error) { next(error); } });
router.put('/me', protect, authorize('entrepreneur'), async (req, res, next) => {
  try {
    const { businessName, location, bio, experience, profileImage, skills, isAvailable } = req.body;
    if (skills && (!Array.isArray(skills) || !(await validateCategories(skills)))) return res.status(400).json({ message: 'One or more skill categories are invalid.' });
    const profile = await ownProfile(req.user._id);
    if (!profile) return res.status(404).json({ message: 'Entrepreneur profile not found.' });
    Object.assign(profile, { ...(businessName !== undefined && { businessName }), ...(location !== undefined && { location }), ...(bio !== undefined && { bio }), ...(experience !== undefined && { experience }), ...(profileImage !== undefined && { profileImage }), ...(skills !== undefined && { skills }), ...(isAvailable !== undefined && { isAvailable }) });
    await profile.save();
    res.json(await populateProfile(Entrepreneur.findById(profile._id)));
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const profile = await populateProfile(Entrepreneur.findOne({ _id: req.params.id, verificationStatus: 'approved' }));
    if (!profile) return res.status(404).json({ message: 'Entrepreneur not found.' });
    const [services, products] = await Promise.all([Service.find({ entrepreneur: profile._id, isAvailable: true }).populate('category', 'name'), Product.find({ entrepreneur: profile._id, isAvailable: true, stock: { $gt: 0 } }).populate('category', 'name')]);
    const Review = (await import('../models/Review.js')).default;
    const rating = await Review.aggregate([{ $match: { entrepreneur: profile._id } }, { $group: { _id: null, averageRating: { $avg: '$rating' }, ratingCount: { $sum: 1 } } }]);
    res.json({ ...profile.toJSON(), services, products, averageRating: rating[0]?.averageRating || 0, ratingCount: rating[0]?.ratingCount || 0 });
  } catch (error) { next(error); }
});
export { ownProfile };
export default router;
