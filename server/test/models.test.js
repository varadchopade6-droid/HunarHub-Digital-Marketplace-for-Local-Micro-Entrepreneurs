import test from 'node:test';
import assert from 'node:assert/strict';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import Service from '../src/models/Service.js';

test('User model rejects invalid role values', () => {
  const user = new User({ name: 'Asha Kumar', email: 'asha@example.com', password: 'securepass', role: 'visitor' });
  const error = user.validateSync();
  assert.ok(error.errors.role);
});

test('User model rejects malformed email', () => {
  const user = new User({ name: 'Asha Kumar', email: 'invalid-email', password: 'securepass' });
  const error = user.validateSync();
  assert.ok(error.errors.email);
});

test('Product model rejects negative price and stock', () => {
  const product = new Product({ entrepreneur: '507f1f77bcf86cd799439011', category: '507f1f77bcf86cd799439012', name: 'Clay pot', price: -1, stock: -2 });
  const error = product.validateSync();
  assert.ok(error.errors.price);
  assert.ok(error.errors.stock);
});

test('Service model requires a name, price, and category', () => {
  const service = new Service({ entrepreneur: '507f1f77bcf86cd799439011' });
  const error = service.validateSync();
  assert.ok(error.errors.name);
  assert.ok(error.errors.price);
  assert.ok(error.errors.category);
});
