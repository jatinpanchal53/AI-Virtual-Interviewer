import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  calculateNextDifficulty,
  getInitialDifficulty,
  isInterviewFinished,
  DIFFICULTY_LEVELS
} from '../services/adaptiveEngine.js';

describe('Adaptive Engine Unit Tests', () => {
  test('maps Beginner to Easy', () => {
    assert.strictEqual(getInitialDifficulty('Beginner'), DIFFICULTY_LEVELS.EASY);
  });

  test('maps Intermediate to Medium', () => {
    assert.strictEqual(getInitialDifficulty('Intermediate'), DIFFICULTY_LEVELS.MEDIUM);
  });

  test('maps Advanced to Hard', () => {
    assert.strictEqual(getInitialDifficulty('Advanced'), DIFFICULTY_LEVELS.HARD);
  });

  test('defaults unknown experience to Medium', () => {
    assert.strictEqual(getInitialDifficulty('Unknown'), DIFFICULTY_LEVELS.MEDIUM);
  });

  test('steps up difficulty when score >= 80 (Easy -> Medium)', () => {
    const result = calculateNextDifficulty(DIFFICULTY_LEVELS.EASY, 85);
    assert.strictEqual(result.nextDifficulty, DIFFICULTY_LEVELS.MEDIUM);
    assert.strictEqual(result.direction, 'UP');
  });

  test('steps up difficulty when score >= 80 (Medium -> Hard)', () => {
    const result = calculateNextDifficulty(DIFFICULTY_LEVELS.MEDIUM, 92);
    assert.strictEqual(result.nextDifficulty, DIFFICULTY_LEVELS.HARD);
    assert.strictEqual(result.direction, 'UP');
  });

  test('caps at Hard when score >= 80 and already Hard', () => {
    const result = calculateNextDifficulty(DIFFICULTY_LEVELS.HARD, 95);
    assert.strictEqual(result.nextDifficulty, DIFFICULTY_LEVELS.HARD);
    assert.strictEqual(result.direction, 'MAINTAIN');
  });

  test('maintains difficulty for average score (50-79)', () => {
    const result = calculateNextDifficulty(DIFFICULTY_LEVELS.MEDIUM, 68);
    assert.strictEqual(result.nextDifficulty, DIFFICULTY_LEVELS.MEDIUM);
    assert.strictEqual(result.direction, 'MAINTAIN');
  });

  test('steps down difficulty when score < 50 (Hard -> Medium)', () => {
    const result = calculateNextDifficulty(DIFFICULTY_LEVELS.HARD, 42);
    assert.strictEqual(result.nextDifficulty, DIFFICULTY_LEVELS.MEDIUM);
    assert.strictEqual(result.direction, 'DOWN');
  });

  test('steps down difficulty when score < 50 (Medium -> Easy)', () => {
    const result = calculateNextDifficulty(DIFFICULTY_LEVELS.MEDIUM, 35);
    assert.strictEqual(result.nextDifficulty, DIFFICULTY_LEVELS.EASY);
    assert.strictEqual(result.direction, 'DOWN');
  });

  test('caps at Easy when score < 50 and already Easy', () => {
    const result = calculateNextDifficulty(DIFFICULTY_LEVELS.EASY, 20);
    assert.strictEqual(result.nextDifficulty, DIFFICULTY_LEVELS.EASY);
    assert.strictEqual(result.direction, 'MAINTAIN');
  });

  test('isInterviewFinished handles bounds correctly', () => {
    assert.strictEqual(isInterviewFinished(5, 5), true);
    assert.strictEqual(isInterviewFinished(6, 5), true);
    assert.strictEqual(isInterviewFinished(2, 5), false);
  });
});
