/**
 * Adaptive Difficulty & Follow-up Engine
 */

export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard'
};

const DIFFICULTY_ORDER = [
  DIFFICULTY_LEVELS.EASY,
  DIFFICULTY_LEVELS.MEDIUM,
  DIFFICULTY_LEVELS.HARD
];

/**
 * Determines initial difficulty level from experience level
 * @param {string} experienceLevel ('Beginner' | 'Intermediate' | 'Advanced')
 * @returns {string} ('Easy' | 'Medium' | 'Hard')
 */
export function getInitialDifficulty(experienceLevel) {
  switch ((experienceLevel || '').toLowerCase()) {
    case 'beginner':
      return DIFFICULTY_LEVELS.EASY;
    case 'advanced':
      return DIFFICULTY_LEVELS.HARD;
    case 'intermediate':
    default:
      return DIFFICULTY_LEVELS.MEDIUM;
  }
}

/**
 * Calculates next adapted difficulty based on previous score and performance trends
 * @param {string} currentDifficulty ('Easy' | 'Medium' | 'Hard')
 * @param {number} overallScore (0-100)
 * @returns {{ nextDifficulty: string, reason: string, direction: 'UP' | 'DOWN' | 'MAINTAIN' }}
 */
export function calculateNextDifficulty(currentDifficulty, overallScore) {
  const currentIndex = DIFFICULTY_ORDER.indexOf(currentDifficulty);
  const safeIndex = currentIndex === -1 ? 1 : currentIndex; // default medium

  if (overallScore >= 80) {
    // High performance -> increase difficulty if not already Hard
    if (safeIndex < DIFFICULTY_ORDER.length - 1) {
      return {
        nextDifficulty: DIFFICULTY_ORDER[safeIndex + 1],
        reason: 'Candidate exhibited strong mastery; stepping up difficulty to probe deeper edge cases.',
        direction: 'UP'
      };
    } else {
      return {
        nextDifficulty: DIFFICULTY_LEVELS.HARD,
        reason: 'Candidate maintained excellent score on Hard questions; maintaining Hard with deep follow-up.',
        direction: 'MAINTAIN'
      };
    }
  } else if (overallScore >= 50) {
    // Moderate performance -> maintain difficulty
    return {
      nextDifficulty: DIFFICULTY_ORDER[safeIndex],
      reason: 'Candidate showed reasonable grasp; maintaining current difficulty level.',
      direction: 'MAINTAIN'
    };
  } else {
    // Struggling -> decrease difficulty if not already Easy
    if (safeIndex > 0) {
      return {
        nextDifficulty: DIFFICULTY_ORDER[safeIndex - 1],
        reason: 'Candidate struggled with question; adjusting difficulty down to evaluate core fundamentals.',
        direction: 'DOWN'
      };
    } else {
      return {
        nextDifficulty: DIFFICULTY_LEVELS.EASY,
        reason: 'Candidate struggled on Easy level; maintaining Easy with concept-checking focus.',
        direction: 'MAINTAIN'
      };
    }
  }
}

/**
 * Evaluates whether interview session has reached its question limit
 * @param {number} currentQuestionOrder 
 * @param {number} totalQuestions 
 * @returns {boolean}
 */
export function isInterviewFinished(currentQuestionOrder, totalQuestions) {
  return currentQuestionOrder >= totalQuestions;
}
