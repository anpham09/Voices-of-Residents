import test from 'node:test';
import assert from 'node:assert';
import Validation from '../js/validation.js';

test('chkErr returns true for matching data', () => {
  const v = new Validation(/^\d+$/);
  assert.strictEqual(v.chkErr('123'), true);
});

test('chkErr returns false for non-matching data', () => {
  const v = new Validation(/^\d+$/);
  assert.strictEqual(v.chkErr('abc'), false);
});