import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProviderInterface } from './aiProvider.interface.js';
import { MockAIProvider } from './mockProvider.js';

export class GeminiAIProvider extends AIProviderInterface {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.mockFallback = new MockAIProvider();
    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      } catch (err) {
        console.warn('Failed to initialize Google Generative AI, falling back to mock provider:', err.message);
        this.model = null;
      }
    }
  }

  async generateQuestion(params) {
    if (!this.model || !this.apiKey) {
      return this.mockFallback.generateQuestion(params);
    }

    try {
      const { role, experienceLevel, interviewType, difficulty, previousQuestions = [], previousAnswers = [], repoContext } = params;
      const historyContext = previousQuestions.map((q, idx) => {
        const ans = previousAnswers[idx]?.answerText || 'No answer';
        return `Q${idx + 1}: ${q.questionText} (Difficulty: ${q.difficulty})\nAnswer: ${ans}`;
      }).join('\n\n');

      let repoContextPrompt = '';
      if (repoContext) {
        const parsedRepo = typeof repoContext === 'string' ? JSON.parse(repoContext) : repoContext;
        repoContextPrompt = `
TARGET GITHUB REPOSITORY TO GRILL CANDIDATE ON:
- Repository: ${parsedRepo.fullName || parsedRepo.repo || 'Project Repo'}
- Description: ${parsedRepo.description || ''}
- Detected Tech Stack: ${(parsedRepo.detectedTech || []).join(', ')}
- Key Files & Structure: ${(parsedRepo.keyFiles || []).slice(0, 15).join(', ')}
- README Excerpt:
${(parsedRepo.readmeSnippet || '').slice(0, 800)}

INSTRUCTIONS FOR PROJECT GRILLING:
Formulate questions specifically anchored on this project's code, file layout, dependencies, architectural decisions, and potential bottlenecks. Ask them why they selected specific libraries, how components communicate, how they handle error boundaries/database transactions/caching, or how they would refactor for 100x traffic.
`;
      }

      const prompt = `You are an elite, highly technical AI Virtual Interviewer conducting a realistic job interview.
Position / Focus: ${role}
Candidate Experience Level: ${experienceLevel}
Interview Type: ${interviewType}
Target Difficulty Level: ${difficulty}
${repoContextPrompt}

Previous questions & candidate answers in this session:
${historyContext || 'None yet (First question of the interview)'}

TASK:
Generate the NEXT interview question.
- If this is a GitHub Project Defense interview, directly probe their architecture, file decisions, and trade-offs in this specific repository.
- If candidate answered prior questions well, increase nuance, probe deeper architectural trade-offs or edge cases.
- If candidate struggled, probe fundamental concepts.
- Do NOT repeat questions already asked.

CRITICAL: Return ONLY a valid, parseable JSON object with no markdown fences, matching this exact schema:
{
  "questionText": "The text of the interview question",
  "category": "e.g. Project Architecture, State Management, Scalability, Database Security",
  "difficulty": "${difficulty}",
  "expectedTopics": ["topic1", "topic2", "topic3", "topic4"]
}`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (!parsed.questionText || !parsed.category) {
        throw new Error('Invalid JSON structure returned from Gemini');
      }

      return {
        questionText: parsed.questionText,
        category: parsed.category,
        difficulty: parsed.difficulty || difficulty,
        expectedTopics: Array.isArray(parsed.expectedTopics) ? parsed.expectedTopics : ['core concepts']
      };
    } catch (error) {
      console.warn('Gemini question generation error, using mock fallback:', error.message);
      return this.mockFallback.generateQuestion(params);
    }
  }

  async evaluateAnswer(params) {
    if (!this.model || !this.apiKey) {
      return this.mockFallback.evaluateAnswer(params);
    }

    try {
      const { questionText, category, difficulty, expectedTopics = [], answerText, role, experienceLevel } = params;

      const prompt = `You are a strict, objective senior hiring manager and tech lead evaluating a candidate's answer in a job interview.
Position: ${role} (${experienceLevel})
Category: ${category}
Difficulty: ${difficulty}
Question: "${questionText}"
Expected Concepts / Topics: ${JSON.stringify(expectedTopics)}

Candidate's Answer:
"""
${answerText || '(No answer provided)'}
"""

TASK:
Thoroughly evaluate this answer.
- Score technical accuracy (0-100), communication clarity (0-100), relevance (0-100), problem-solving depth (0-100), and an overall weighted score (0-100).
- Identify concrete strengths and specific weaknesses / gaps.
- List any missing technical concepts.
- Suggest next difficulty level: "Hard" if overall >= 80, "Medium" if 50-79, "Easy" if < 50.

CRITICAL: Return ONLY a valid, parseable JSON object with no markdown fences, matching this exact schema:
{
  "technicalScore": 85,
  "communicationScore": 80,
  "relevanceScore": 90,
  "problemSolvingScore": 80,
  "overallScore": 84,
  "feedback": "Concise 2-3 sentence personalized feedback explaining the rating.",
  "strengths": ["Clear explanation of X", "Good real-world example of Y"],
  "weaknesses": ["Missed discussing Z trade-off"],
  "missingConcepts": ["concept A", "concept B"],
  "suggestedNextDifficulty": "Hard"
}`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        technicalScore: Number(parsed.technicalScore) || 50,
        communicationScore: Number(parsed.communicationScore) || 50,
        relevanceScore: Number(parsed.relevanceScore) || 50,
        problemSolvingScore: Number(parsed.problemSolvingScore) || 50,
        overallScore: Number(parsed.overallScore) || 50,
        feedback: parsed.feedback || 'Answer evaluated.',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Attempted question'],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ['Need more details'],
        missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
        suggestedNextDifficulty: parsed.suggestedNextDifficulty || difficulty
      };
    } catch (error) {
      console.warn('Gemini answer evaluation error, using mock fallback:', error.message);
      return this.mockFallback.evaluateAnswer(params);
    }
  }

  async generateFinalReport(params) {
    if (!this.model || !this.apiKey) {
      return this.mockFallback.generateFinalReport(params);
    }

    try {
      const { role, experienceLevel, interviewType, totalQuestions, answersWithQuestions = [] } = params;

      const summaryPayload = answersWithQuestions.map((item, idx) => ({
        question: item.question.questionText,
        difficulty: item.question.difficulty,
        answer: item.answer.answerText,
        overallScore: item.answer.overallScore,
        technicalScore: item.answer.technicalScore,
        feedback: item.answer.feedback,
        missingConcepts: item.answer.missingConcepts
      }));

      const prompt = `You are a Principal Engineer and Talent Lead compiling a comprehensive final interview performance report.
Role: ${role} (${experienceLevel})
Interview Type: ${interviewType}
Total Questions Completed: ${answersWithQuestions.length}

Candidate performance across all questions:
${JSON.stringify(summaryPayload, null, 2)}

TASK:
Produce a detailed, highly constructive, actionable performance report.
Identify specific skill gaps (e.g., specific algorithms, architecture patterns, SQL features), highlight distinct strengths, and provide a 4-step personalized improvement roadmap.

CRITICAL: Return ONLY a valid, parseable JSON object with no markdown fences, matching this exact schema:
{
  "summary": "High-level summary of candidate performance, strengths, and readiness for the role (3-4 sentences).",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "skillGaps": [
    { "skill": "Topic Name", "gap": "Explanation of the gap", "severity": "High" }
  ],
  "recommendedTopics": ["topic 1 to study", "topic 2 to study", "topic 3 to study"],
  "improvementPlan": ["Step 1 actionable advice", "Step 2 actionable advice", "Step 3 actionable advice", "Step 4 actionable advice"]
}`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        summary: parsed.summary,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        skillGaps: Array.isArray(parsed.skillGaps) ? parsed.skillGaps : [],
        recommendedTopics: Array.isArray(parsed.recommendedTopics) ? parsed.recommendedTopics : [],
        improvementPlan: Array.isArray(parsed.improvementPlan) ? parsed.improvementPlan : []
      };
    } catch (error) {
      console.warn('Gemini report generation error, using mock fallback:', error.message);
      return this.mockFallback.generateFinalReport(params);
    }
  }
}
