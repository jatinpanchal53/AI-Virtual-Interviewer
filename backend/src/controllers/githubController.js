import { githubService } from '../services/githubService.js';

export class GitHubController {
  async analyze(req, res, next) {
    try {
      const { repoUrl } = req.body;
      if (!repoUrl) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'repoUrl is required'
          }
        });
      }

      const analysis = await githubService.analyzeRepository(repoUrl);
      res.status(200).json({
        success: true,
        data: analysis,
        message: 'GitHub repository analyzed successfully'
      });
    } catch (err) {
      next(err);
    }
  }
}

export const githubController = new GitHubController();
