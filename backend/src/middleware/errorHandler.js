export function errorHandler(err, req, res, next) {
  console.error('[API ERROR]', err);

  const status = err.statusCode || err.status || 500;
  const code = err.code || (status === 400 ? 'VALIDATION_ERROR' : status === 404 ? 'NOT_FOUND' : status === 401 ? 'UNAUTHORIZED' : 'SERVER_ERROR');
  const message = err.message || 'An unexpected internal error occurred';

  res.status(status).json({
    success: false,
    error: {
      code,
      message
    }
  });
}
