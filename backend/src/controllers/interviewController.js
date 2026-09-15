import { interviewService } from '../services/interviewService.js';
import { reportService } from '../services/reportService.js';

export class InterviewController {
  async createInterview(req, res, next) {
    try {
      const { role, experienceLevel, interviewType, totalQuestions, repoUrl } = req.body;
      const userId = req.user?.id || 'public';
      const interview = await interviewService.createInterview(userId, {
        role,
        experienceLevel,
        interviewType,
        totalQuestions,
        repoUrl
      });

      res.status(201).json({
        success: true,
        data: interview,
        message: 'Interview session created'
      });
    } catch (err) {
      next(err);
    }
  }

  async getUserInterviews(req, res, next) {
    try {
      const userId = req.user?.id || 'public';
      const interviews = await interviewService.getUserInterviews(userId);
      res.status(200).json({
        success: true,
        data: interviews,
        message: 'User interview history retrieved'
      });
    } catch (err) {
      next(err);
    }
  }

  async getInterviewById(req, res, next) {
    try {
      const { interviewId } = req.params;
      const userId = req.user?.id || 'public';
      const interview = await interviewService.getInterviewById(interviewId, userId);
      res.status(200).json({
        success: true,
        data: interview,
        message: 'Interview details retrieved'
      });
    } catch (err) {
      next(err);
    }
  }

  async startInterview(req, res, next) {
    try {
      const { interviewId } = req.params;
      const userId = req.user?.id || 'public';
      const result = await interviewService.startInterview(interviewId, userId);
      res.status(200).json({
        success: true,
        data: result,
        message: 'Interview session started'
      });
    } catch (err) {
      next(err);
    }
  }

  async getCurrentQuestion(req, res, next) {
    try {
      const { interviewId } = req.params;
      const userId = req.user?.id || 'public';
      const question = await interviewService.getCurrentQuestion(interviewId, userId);
      res.status(200).json({
        success: true,
        data: question,
        message: question ? 'Current question retrieved' : 'No active unanswered questions found'
      });
    } catch (err) {
      next(err);
    }
  }

  async submitAnswer(req, res, next) {
    try {
      const { interviewId } = req.params;
      const { questionId, answerText } = req.body;
      const userId = req.user?.id || 'public';

      if (!questionId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'questionId is required'
          }
        });
      }

      const result = await interviewService.submitAnswer(interviewId, userId, {
        questionId,
        answerText: answerText || ''
      });

      res.status(200).json({
        success: true,
        data: result,
        message: result.isFinished ? 'Interview completed' : 'Answer evaluated and next question generated'
      });
    } catch (err) {
      next(err);
    }
  }

  async getResults(req, res, next) {
    try {
      const { interviewId } = req.params;
      let report = await reportService.getFormattedReport(interviewId);

      // If report doesn't exist yet but interview has answers, generate it
      if (!report) {
        report = await reportService.generateAndSaveReport(interviewId);
      }

      res.status(200).json({
        success: true,
        data: report,
        message: 'Interview evaluation report retrieved'
      });
    } catch (err) {
      next(err);
    }
  }
}

export const interviewController = new InterviewController();
