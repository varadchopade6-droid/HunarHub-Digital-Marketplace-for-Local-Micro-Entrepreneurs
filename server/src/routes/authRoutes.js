import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Entrepreneur from '../models/Entrepreneur.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const tokenFor = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const userPayload = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
    if (!['customer', 'entrepreneur'].includes(role)) return res.status(400).json({ message: 'Registration role must be customer or entrepreneur.' });
    const user = await User.create({ name, email, password, role });
    if (role === 'entrepreneur') await Entrepreneur.create({ user: user._id });
    res.status(201).json({ token: tokenFor(user), user: userPayload(user), verificationStatus: role === 'entrepreneur' ? 'pending' : undefined });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password.' });
    res.json({ token: tokenFor(user), user: userPayload(user) });
  } catch (error) { next(error); }
});

router.get('/me', protect, (req, res) => res.json({ user: userPayload(req.user) }));
export default router;
