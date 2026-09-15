import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MockAIProvider } from '../ai/mockProvider.js';

describe('Mock AI Provider Tests', () => {
  const provider = new MockAIProvider();

  test('generates questions with required structure and non-empty expected topics', async () => {
    const q = await provider.generateQuestion({
      role: 'Frontend Developer',
      experienceLevel: 'Intermediate',
      interviewType: 'Technical',
      difficulty: 'Medium'
    });

    assert.ok(q.questionText);
    assert.strictEqual(typeof q.questionText, 'string');
    assert.ok(q.questionText.length > 10);
    assert.ok(q.category);
    assert.strictEqual(q.difficulty, 'Medium');
    assert.ok(Array.isArray(q.expectedTopics));
    assert.ok(q.expectedTopics.length > 0);
  });

  test('evaluates answers and returns full score breakdown, strengths, weaknesses', async () => {
    const evaluation = await provider.evaluateAnswer({
      questionText: 'Explain the difference between var, let, and const in JavaScript.',
      category: 'JavaScript Fundamentals',
      difficulty: 'Easy',
      expectedTopics: ['hoisting', 'block scope', 'function scope', 'reassignment', 'temporal dead zone'],
      answerText: 'var has function scope and gets hoisted with undefined. let and const have block scope and live in the temporal dead zone until declared. const cannot be reassigned.',
      role: 'Frontend Developer',
      experienceLevel: 'Beginner'
    });

    assert.ok(evaluation.overallScore >= 70);
    assert.ok(evaluation.technicalScore > 0);
    assert.ok(evaluation.communicationScore > 0);
    assert.ok(Array.isArray(evaluation.strengths));
    assert.ok(Array.isArray(evaluation.weaknesses));
    assert.strictEqual(typeof evaluation.feedback, 'string');
  });

  test('generates comprehensive final report with skill gaps and improvement plan', async () => {
    const report = await provider.generateFinalReport({
      role: 'Frontend Developer',
      experienceLevel: 'Intermediate',
      interviewType: 'Technical',
      totalQuestions: 2,
      answersWithQuestions: [
        {
          question: { questionText: 'Q1', difficulty: 'Medium', category: 'React' },
          answer: {
            overallScore: 85,
            technicalScore: 85,
            communicationScore: 80,
            relevanceScore: 90,
            problemSolvingScore: 85,
            strengths: JSON.stringify(['Understands React Lifecycle']),
            weaknesses: JSON.stringify(['Could mention SSR']),
            missingConcepts: JSON.stringify(['Server Components'])
          }
        }
      ]
    });

    assert.ok(report.summary);
    assert.ok(Array.isArray(report.strengths));
    assert.ok(Array.isArray(report.weaknesses));
    assert.ok(Array.isArray(report.skillGaps));
    assert.ok(Array.isArray(report.improvementPlan));
    assert.ok(report.improvementPlan.length > 0);
  });
});
