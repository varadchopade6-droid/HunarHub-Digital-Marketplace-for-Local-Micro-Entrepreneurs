import test from 'node:test';
import assert from 'node:assert/strict';
import User from '../src/models/User.js';

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
