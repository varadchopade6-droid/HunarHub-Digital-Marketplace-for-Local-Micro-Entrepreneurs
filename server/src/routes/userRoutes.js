import { Router } from 'express';
import { protect } from '../middleware/auth.js';
const router = Router();
router.get('/me', protect, (req, res) => res.json({ user: req.user }));
export default router;
