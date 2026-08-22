import Category from '../models/Category.js';

export const DEFAULT_CATEGORIES = ['Cobbler', 'Potter/Kumhar', 'Tailor', 'Artisan', 'Small Vendor'];
export async function ensureDefaultCategories() {
  await Promise.all(DEFAULT_CATEGORIES.map((name) => Category.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true })));
}
