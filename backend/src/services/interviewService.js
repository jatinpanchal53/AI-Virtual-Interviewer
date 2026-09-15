import prisma from '../prisma/client.js';
import { getAIProvider } from '../ai/aiManager.js';
import { getInitialDifficulty, calculateNextDifficulty, isInterviewFinished } from './adaptiveEngine.js';
import { reportService } from './reportService.js';
import { githubService } from './githubService.js';

export class InterviewService {
  /**
   * Create a new interview record (supports both standard and GitHub project defense modes)
   */
  async createInterview(userId, { role, experienceLevel = 'Intermediate', interviewType = 'Technical', totalQuestions = 5, repoUrl = null }) {
    let repoName = null;
    let repoContext = null;

    if (repoUrl && repoUrl.trim() !== '') {
      try {
        const repoData = await githubService.analyzeRepository(repoUrl.trim());
        repoName = repoData.fullName || repoData.repo;
        repoContext = JSON.stringify(repoData);
        if (!role || role.trim() === '') {
          role = `${repoName} Project Defense`;
        }
      } catch (repoErr) {
        console.warn('Failed to analyze repo during creation, using fallback:', repoErr.message);
        const parsed = githubService.parseRepoUrl(repoUrl);
        repoName = `${parsed.owner}/${parsed.repo}`;
        repoContext = JSON.stringify(githubService.getFallbackAnalysis(parsed.owner, parsed.repo));
      }
    }

    const interview = await prisma.interview.create({
      data: {
        userId,
        role: role || 'Software Engineer',
        experienceLevel,
        interviewType: repoUrl ? 'Project Defense' : interviewType,
        totalQuestions: Math.max(1, Math.min(10, parseInt(totalQuestions, 10) || 5)),
        repoUrl: repoUrl ? repoUrl.trim() : null,
        repoName,
        repoContext,
        status: 'pending'
      }
    });

    return interview;
  }

  /**
   * Start the interview session and generate the first question
   */
  async startInterview(interviewId, userId) {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: { questions: true }
    });

    if (!interview) {
      throw new Error('Interview not found');
    }

    if (interview.status === 'completed') {
      return { status: 'completed', interview };
    }

    // If first question already generated, return it
    if (interview.questions.length > 0) {
      const activeQ = await this.getCurrentQuestion(interviewId, userId);
      return { status: interview.status, interview, currentQuestion: activeQ };
    }

    // Determine initial difficulty
    const initialDiff = getInitialDifficulty(interview.experienceLevel);
    const aiProvider = getAIProvider();

    // Generate Question 1
    const generatedQ = await aiProvider.generateQuestion({
      role: interview.role,
      experienceLevel: interview.experienceLevel,
      interviewType: interview.interviewType,
      difficulty: initialDiff,
      previousQuestions: [],
      previousAnswers: [],
      repoContext: interview.repoContext
    });

    const question = await prisma.question.create({
      data: {
        interviewId: interview.id,
        questionText: generatedQ.questionText,
        category: generatedQ.category,
        difficulty: generatedQ.difficulty || initialDiff,
        questionOrder: 1,
        expectedTopics: JSON.stringify(generatedQ.expectedTopics || [])
      }
    });

    // Update status to in_progress
    const updated = await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'in_progress' }
    });

    return {
      status: 'in_progress',
      interview: updated,
      currentQuestion: {
        id: question.id,
        order: question.questionOrder,
        totalQuestions: interview.totalQuestions,
        questionText: question.questionText,
        category: question.category,
        difficulty: question.difficulty,
        expectedTopics: JSON.parse(question.expectedTopics)
      }
    };
  }

  /**
   * Get active unanswered question
   */
  async getCurrentQuestion(interviewId, userId) {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        questions: {
          orderBy: { questionOrder: 'desc' },
          include: { answer: true }
        }
      }
    });

    if (!interview) {
      throw new Error('Interview not found');
    }

    if (interview.status === 'completed') {
      return null;
    }

    const latestQuestion = interview.questions[0];
    if (!latestQuestion || latestQuestion.answer) {
      return null;
    }

    return {
      id: latestQuestion.id,
      order: latestQuestion.questionOrder,
      totalQuestions: interview.totalQuestions,
      questionText: latestQuestion.questionText,
      category: latestQuestion.category,
      difficulty: latestQuestion.difficulty,
      expectedTopics: JSON.parse(latestQuestion.expectedTopics || '[]')
    };
  }

  /**
   * Submit candidate answer, evaluate via AI, adapt difficulty, and trigger next step
   */
  async submitAnswer(interviewId, userId, { questionId, answerText }) {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' },
          include: { answer: true }
        }
      }
    });

    if (!interview) {
      throw new Error('Interview not found');
    }

    const question = interview.questions.find(q => q.id === questionId);
    if (!question) {
      throw new Error('Question does not belong to this interview');
    }

    if (question.answer) {
      throw new Error('This question has already been answered');
    }

    // Evaluate answer with AI Provider
    const aiProvider = getAIProvider();
    const expectedTopics = JSON.parse(question.expectedTopics || '[]');

    const evaluation = await aiProvider.evaluateAnswer({
      questionText: question.questionText,
      category: question.category,
      difficulty: question.difficulty,
      expectedTopics,
      answerText: (answerText || '').trim(),
      role: interview.role,
      experienceLevel: interview.experienceLevel
    });

    // Save Answer record
    const savedAnswer = await prisma.answer.create({
      data: {
        questionId: question.id,
        answerText: (answerText || '').trim(),
        technicalScore: evaluation.technicalScore,
        communicationScore: evaluation.communicationScore,
        relevanceScore: evaluation.relevanceScore,
        problemSolvingScore: evaluation.problemSolvingScore,
        overallScore: evaluation.overallScore,
        feedback: evaluation.feedback,
        strengths: JSON.stringify(evaluation.strengths || []),
        weaknesses: JSON.stringify(evaluation.weaknesses || []),
        missingConcepts: JSON.stringify(evaluation.missingConcepts || [])
      }
    });

    const isFinished = isInterviewFinished(question.questionOrder, interview.totalQuestions);

    let nextQuestion = null;
    let finalReport = null;

    if (isFinished) {
      // Interview complete -> generate final report
      finalReport = await reportService.generateAndSaveReport(interviewId);
    } else {
      // Adapt difficulty based on performance
      const { nextDifficulty, reason, direction } = calculateNextDifficulty(
        question.difficulty,
        evaluation.overallScore
      );

      // Gather history context for AI
      const prevQList = interview.questions.map(q => ({
        questionText: q.questionText,
        difficulty: q.difficulty
      }));
      prevQList.push({ questionText: question.questionText, difficulty: question.difficulty });

      const prevAList = interview.questions
        .filter(q => q.answer)
        .map(q => ({ answerText: q.answer.answerText }));
      prevAList.push({ answerText: savedAnswer.answerText });

      // Generate next question
      const nextQData = await aiProvider.generateQuestion({
        role: interview.role,
        experienceLevel: interview.experienceLevel,
        interviewType: interview.interviewType,
        difficulty: nextDifficulty,
        previousQuestions: prevQList,
        previousAnswers: prevAList,
        repoContext: interview.repoContext
      });

      const createdNextQ = await prisma.question.create({
        data: {
          interviewId: interview.id,
          questionText: nextQData.questionText,
          category: nextQData.category,
          difficulty: nextQData.difficulty || nextDifficulty,
          questionOrder: question.questionOrder + 1,
          expectedTopics: JSON.stringify(nextQData.expectedTopics || [])
        }
      });

      nextQuestion = {
        id: createdNextQ.id,
        order: createdNextQ.questionOrder,
        totalQuestions: interview.totalQuestions,
        questionText: createdNextQ.questionText,
        category: createdNextQ.category,
        difficulty: createdNextQ.difficulty,
        adaptationReason: reason,
        adaptationDirection: direction,
        expectedTopics: JSON.parse(createdNextQ.expectedTopics || '[]')
      };
    }

    return {
      isFinished,
      evaluation: {
        id: savedAnswer.id,
        questionId: question.id,
        overallScore: savedAnswer.overallScore,
        technicalScore: savedAnswer.technicalScore,
        communicationScore: savedAnswer.communicationScore,
        relevanceScore: savedAnswer.relevanceScore,
        problemSolvingScore: savedAnswer.problemSolvingScore,
        feedback: savedAnswer.feedback,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        missingConcepts: evaluation.missingConcepts
      },
      nextQuestion,
      finalReport
    };
  }

  /**
   * List all interviews of a user
   */
  async getUserInterviews(userId) {
    const interviews = await prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        questions: {
          select: { id: true, questionOrder: true, difficulty: true, category: true }
        },
        report: {
          select: { id: true, summary: true }
        }
      }
    });

    return interviews.map(i => ({
      id: i.id,
      role: i.role,
      experienceLevel: i.experienceLevel,
      interviewType: i.interviewType,
      totalQuestions: i.totalQuestions,
      status: i.status,
      overallScore: i.overallScore,
      createdAt: i.createdAt,
      completedAt: i.completedAt,
      questionCount: i.questions.length,
      hasReport: !!i.report
    }));
  }

  /**
   * Get single interview summary
   */
  async getInterviewById(interviewId, userId) {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' },
          include: { answer: true }
        },
        report: true
      }
    });

    if (!interview) {
      throw new Error('Interview not found');
    }

    return {
      id: interview.id,
      role: interview.role,
      experienceLevel: interview.experienceLevel,
      interviewType: interview.interviewType,
      totalQuestions: interview.totalQuestions,
      status: interview.status,
      overallScore: interview.overallScore,
      createdAt: interview.createdAt,
      completedAt: interview.completedAt,
      questions: interview.questions.map(q => ({
        id: q.id,
        order: q.questionOrder,
        questionText: q.questionText,
        category: q.category,
        difficulty: q.difficulty,
        hasAnswer: !!q.answer,
        score: q.answer?.overallScore || null
      })),
      hasReport: !!interview.report
    };
  }
}

export const interviewService = new InterviewService();
