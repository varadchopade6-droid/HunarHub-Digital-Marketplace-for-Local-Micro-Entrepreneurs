import { Router } from 'express';
import Category from '../models/Category.js';
import { ensureDefaultCategories } from '../config/categories.js';
const router = Router();
router.get('/', async (req, res, next) => { try { await ensureDefaultCategories(); res.json(await Category.find({ isActive: true }).sort('name')); } catch (error) { next(error); } });
export default router;
