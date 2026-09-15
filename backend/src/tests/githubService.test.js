import { test, describe } from 'node:test';
import assert from 'node:assert';
import { githubService } from '../services/githubService.js';

describe('GitHub Service Unit Tests', () => {
  test('correctly parses full GitHub HTTPS URLs', () => {
    const { owner, repo } = githubService.parseRepoUrl('https://github.com/facebook/react');
    assert.strictEqual(owner, 'facebook');
    assert.strictEqual(repo, 'react');
  });

  test('correctly parses GitHub URLs with .git suffix and trailing slash', () => {
    const { owner, repo } = githubService.parseRepoUrl('https://github.com/vercel/next.js.git/');
    assert.strictEqual(owner, 'vercel');
    assert.strictEqual(repo, 'next.js');
  });

  test('correctly parses owner/repo shorthand format', () => {
    const { owner, repo } = githubService.parseRepoUrl('expressjs/express');
    assert.strictEqual(owner, 'expressjs');
    assert.strictEqual(repo, 'express');
  });

  test('generates fallback analysis profile with detected technologies', () => {
    const fallback = githubService.getFallbackAnalysis('testuser', 'awesome-react-app');
    assert.strictEqual(fallback.owner, 'testuser');
    assert.strictEqual(fallback.repo, 'awesome-react-app');
    assert.ok(Array.isArray(fallback.detectedTech));
    assert.ok(fallback.detectedTech.includes('React'));
    assert.ok(Array.isArray(fallback.keyFiles));
    assert.ok(fallback.keyFiles.length > 0);
  });
});
