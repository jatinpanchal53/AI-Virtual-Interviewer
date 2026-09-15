/**
 * Base AI Provider Interface Definition
 */
export class AIProviderInterface {
  /**
   * Generates an interview question
   * @param {Object} params
   * @returns {Promise<{ questionText: string, category: string, difficulty: string, expectedTopics: string[] }>}
   */
  async generateQuestion(params) {
    throw new Error('generateQuestion must be implemented by provider');
  }

  /**
   * Evaluates a candidate answer
   * @param {Object} params
   * @returns {Promise<{
   *   technicalScore: number,
   *   communicationScore: number,
   *   relevanceScore: number,
   *   problemSolvingScore: number,
   *   overallScore: number,
   *   feedback: string,
   *   strengths: string[],
   *   weaknesses: string[],
   *   missingConcepts: string[],
   *   suggestedNextDifficulty: string
   * }>}
   */
  async evaluateAnswer(params) {
    throw new Error('evaluateAnswer must be implemented by provider');
  }

  /**
   * Generates a comprehensive final report
   * @param {Object} params
   * @returns {Promise<{
   *   summary: string,
   *   strengths: string[],
   *   weaknesses: string[],
   *   skillGaps: Array<{ skill: string, gap: string, severity: 'High'|'Medium'|'Low' }>,
   *   recommendedTopics: string[],
   *   improvementPlan: string[]
   * }>}
   */
  async generateFinalReport(params) {
    throw new Error('generateFinalReport must be implemented by provider');
  }
}
