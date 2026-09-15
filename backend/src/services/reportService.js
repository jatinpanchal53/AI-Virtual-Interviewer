import prisma from '../prisma/client.js';
import { getAIProvider } from '../ai/aiManager.js';

export class ReportService {
  /**
   * Aggregates questions and answers, computes final scores and generates AI report
   * @param {string} interviewId
   */
  async generateAndSaveReport(interviewId) {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' },
          include: { answer: true }
        }
      }
    });

    if (!interview) {
      throw new Error(`Interview not found: ${interviewId}`);
    }

    const answeredItems = interview.questions
      .filter(q => q.answer !== null)
      .map(q => ({
        question: q,
        answer: q.answer
      }));

    if (answeredItems.length === 0) {
      throw new Error('Cannot generate report for an interview with no answers');
    }

    // Calculate aggregate score metrics
    const totalAnswers = answeredItems.length;
    let sumOverall = 0;
    let sumTech = 0;
    let sumComm = 0;
    let sumRelevance = 0;
    let sumProblem = 0;

    answeredItems.forEach(({ answer }) => {
      sumOverall += answer.overallScore;
      sumTech += answer.technicalScore;
      sumComm += answer.communicationScore;
      sumRelevance += answer.relevanceScore;
      sumProblem += answer.problemSolvingScore;
    });

    const overallScore = Math.round((sumOverall / totalAnswers) * 10) / 10;
    const technicalScore = Math.round((sumTech / totalAnswers) * 10) / 10;
    const communicationScore = Math.round((sumComm / totalAnswers) * 10) / 10;
    const relevanceScore = Math.round((sumRelevance / totalAnswers) * 10) / 10;
    const problemSolvingScore = Math.round((sumProblem / totalAnswers) * 10) / 10;

    // Call AI Provider for deep natural language report
    const aiProvider = getAIProvider();
    const aiReport = await aiProvider.generateFinalReport({
      role: interview.role,
      experienceLevel: interview.experienceLevel,
      interviewType: interview.interviewType,
      totalQuestions: interview.totalQuestions,
      answersWithQuestions: answeredItems
    });

    // Save or update InterviewReport in database
    const savedReport = await prisma.interviewReport.upsert({
      where: { interviewId },
      update: {
        summary: aiReport.summary,
        strengths: JSON.stringify(aiReport.strengths || []),
        weaknesses: JSON.stringify(aiReport.weaknesses || []),
        skillGaps: JSON.stringify(aiReport.skillGaps || []),
        recommendedTopics: JSON.stringify(aiReport.recommendedTopics || []),
        improvementPlan: JSON.stringify(aiReport.improvementPlan || [])
      },
      create: {
        interviewId,
        summary: aiReport.summary,
        strengths: JSON.stringify(aiReport.strengths || []),
        weaknesses: JSON.stringify(aiReport.weaknesses || []),
        skillGaps: JSON.stringify(aiReport.skillGaps || []),
        recommendedTopics: JSON.stringify(aiReport.recommendedTopics || []),
        improvementPlan: JSON.stringify(aiReport.improvementPlan || [])
      }
    });

    // Mark Interview completed with final overall score
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'completed',
        overallScore,
        completedAt: new Date()
      }
    });

    return {
      reportId: savedReport.id,
      interviewId,
      overallScore,
      breakdown: {
        technicalScore,
        communicationScore,
        relevanceScore,
        problemSolvingScore
      },
      summary: aiReport.summary,
      strengths: aiReport.strengths,
      weaknesses: aiReport.weaknesses,
      skillGaps: aiReport.skillGaps,
      recommendedTopics: aiReport.recommendedTopics,
      improvementPlan: aiReport.improvementPlan,
      questions: answeredItems.map(item => ({
        id: item.question.id,
        order: item.question.questionOrder,
        questionText: item.question.questionText,
        category: item.question.category,
        difficulty: item.question.difficulty,
        answerText: item.answer.answerText,
        overallScore: item.answer.overallScore,
        technicalScore: item.answer.technicalScore,
        communicationScore: item.answer.communicationScore,
        relevanceScore: item.answer.relevanceScore,
        problemSolvingScore: item.answer.problemSolvingScore,
        feedback: item.answer.feedback,
        strengths: typeof item.answer.strengths === 'string' ? JSON.parse(item.answer.strengths) : item.answer.strengths,
        weaknesses: typeof item.answer.weaknesses === 'string' ? JSON.parse(item.answer.weaknesses) : item.answer.weaknesses,
        missingConcepts: typeof item.answer.missingConcepts === 'string' ? JSON.parse(item.answer.missingConcepts || '[]') : (item.answer.missingConcepts || [])
      }))
    };
  }

  async getFormattedReport(interviewId) {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        report: true,
        questions: {
          orderBy: { questionOrder: 'asc' },
          include: { answer: true }
        }
      }
    });

    if (!interview || !interview.report) {
      return null;
    }

    const answeredItems = interview.questions.filter(q => q.answer !== null);
    const totalAnswers = answeredItems.length || 1;

    let sumTech = 0;
    let sumComm = 0;
    let sumRelevance = 0;
    let sumProblem = 0;

    answeredItems.forEach(q => {
      sumTech += q.answer.technicalScore;
      sumComm += q.answer.communicationScore;
      sumRelevance += q.answer.relevanceScore;
      sumProblem += q.answer.problemSolvingScore;
    });

    return {
      reportId: interview.report.id,
      interviewId: interview.id,
      role: interview.role,
      experienceLevel: interview.experienceLevel,
      interviewType: interview.interviewType,
      totalQuestions: interview.totalQuestions,
      status: interview.status,
      overallScore: interview.overallScore,
      completedAt: interview.completedAt,
      createdAt: interview.createdAt,
      breakdown: {
        technicalScore: Math.round((sumTech / totalAnswers) * 10) / 10,
        communicationScore: Math.round((sumComm / totalAnswers) * 10) / 10,
        relevanceScore: Math.round((sumRelevance / totalAnswers) * 10) / 10,
        problemSolvingScore: Math.round((sumProblem / totalAnswers) * 10) / 10
      },
      summary: interview.report.summary,
      strengths: JSON.parse(interview.report.strengths || '[]'),
      weaknesses: JSON.parse(interview.report.weaknesses || '[]'),
      skillGaps: JSON.parse(interview.report.skillGaps || '[]'),
      recommendedTopics: JSON.parse(interview.report.recommendedTopics || '[]'),
      improvementPlan: JSON.parse(interview.report.improvementPlan || '[]'),
      questions: answeredItems.map(item => ({
        id: item.id,
        order: item.questionOrder,
        questionText: item.questionText,
        category: item.category,
        difficulty: item.difficulty,
        answerText: item.answer.answerText,
        overallScore: item.answer.overallScore,
        technicalScore: item.answer.technicalScore,
        communicationScore: item.answer.communicationScore,
        relevanceScore: item.answer.relevanceScore,
        problemSolvingScore: item.answer.problemSolvingScore,
        feedback: item.answer.feedback,
        strengths: JSON.parse(item.answer.strengths || '[]'),
        weaknesses: JSON.parse(item.answer.weaknesses || '[]'),
        missingConcepts: JSON.parse(item.answer.missingConcepts || '[]')
      }))
    };
  }
}

export const reportService = new ReportService();
